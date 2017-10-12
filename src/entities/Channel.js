const pick = require('object.pick');

const Command = require('./Command');

class Channel {
  static create(props) {
    return new Channel(props);
  }

  constructor({ id, queue }) {
    this.id = id;
    this._queue = queue;
  }

  command() {
    return Command.create();
  }

  onRequest(cb) {
    this.onRequest = cb;
  }

  toObject() {
    return pick(this, ['id']);
  }
}

module.exports = Channel;
