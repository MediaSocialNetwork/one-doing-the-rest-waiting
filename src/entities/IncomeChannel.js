const Channel = require('./Channel');
const Command = require('./Command');

class IncomeChannel extends Channel {
  static create(props) {
    return new IncomeChannel(props);
  }

  constructor(props) {
    super(props);
    this._pendingLists = {};

    // this._listenCommands();
    this._listen(`channel:${this.id}:inbox`, this._handleRequest.bind(this));
  }

  _handleRequest(command) {
    let key = command.key || 'xxx';
    let pendingList = this._getPendingListByKey(key);

    pendingList.push(command);

    if (pendingList.length === 1) {
      this._handler(command, response => {
        this._replyForKey(key, response);
      });
    }
  }

  _listenCommands() {
    this._queue
      .process(`channel:${this.id}:command`, (job, done) => {
        let command = Command.create(Object.assign(job.data, {
          channel: this
        }));

        let pendingList = this._getPendingListByKey(command.key);

        pendingList.push(job.id);

        done();

        if (pendingList.length === 1) {
          if (this._handler) {
            this._handler(job.data, response => {
              this._replyForKey(command.key, response);
            });
          }
        }
      });
  }

  _getPendingListByKey(key) {
    if (!this._pendingLists[key]) {
      this._pendingLists[key] = [];
    }

    return this._pendingLists[key];
  }

  _replyForKey(key, response) {
    let pendingList = this._getPendingListByKey(key);

    pendingList.forEach(command => {
      this._send(Command.create({
        id: command.id,
        dest: command.src,
        src: command.dest,
        type: `response:${command.type}`,
        data: response
      }));
    })

    pendingList.length = 0;
  }

  onRequest(handler) {
    this._handler = handler;
  }
}

module.exports = IncomeChannel;
