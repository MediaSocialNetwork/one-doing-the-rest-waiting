const pick = require('object.pick');
const uuid = require('uuid');

const Command = require('./Command');

class Channel {
  static create(props) {
    return new Channel(props);
  }

  constructor({ queue }) {
    this.id = uuid.v4();
    this._queue = queue;
  }

  serialize() {
    return pick(this, [ 'id' ]);
  }

  _listen(source, handler) {
    this._queue
      .process(source, (job, done) => {
        let command = Command.create(job.data);
        console.log(`channel ${this.id} received [${command.id}]`);

        done();

        if (handler) {
          handler(command);
        }
      });
  }

  _send(command, done) {
    let { dest } = command;

    let job = this._queue
      .create(dest, command.serialize())
      .save(() => {
        console.log(`channel ${this.id} sent [${command.id}]`);

        if (done) {
          done(job);
        }
      });
  }
}

module.exports = Channel;
