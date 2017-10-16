const debug = require('debug')('odtrw');
const pick = require('object.pick');
const uuid = require('uuid');

const Message = require('./Message');

class Channel {
  static create(props) {
    return new Channel(props);
  }

  constructor({ queue, prefix }) {
    this.id = uuid.v4();
    this._queue = queue;
    this._prefix = prefix;
  }

  serialize() {
    return pick(this, [ 'id' ]);
  }

  _listen(source, handler) {
    this._queue
      .process(source, (job, done) => {
        let message = Message.create(job.data);

        debug(`channel ${this.id} received [${message.id}]`);

        done();

        if (handler) {
          handler(message);
        }
      });
  }

  _send(message, done) {
    let { dest } = message;

    let job = this._queue
      .create(dest, message.serialize())
      .save(() => {
        debug(`channel ${this.id} sent [${message.id}]`);

        if (done) {
          done(job);
        }
      });
  }
}

module.exports = Channel;
