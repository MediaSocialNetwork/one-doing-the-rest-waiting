const pick = require('object.pick');

class Channel {
  static create(props) {
    return new Channel(props);
  }

  constructor({ id, queue }) {
    this.id = id;
    this._queue = queue;
  }

  serialize() {
    return pick(this, ['id']);
  }
}

module.exports = Channel;
