const pick = require('object.pick');
const uuid = require('uuid');

class Command {
  static create(props) {
    return new Command(props);
  }

  constructor({ id, channel, dest, src, type, data, config }) {
    this.id = id || uuid.v4();

    this.dest = dest;
    this.src = src;
    this.type = type;
    this.data = data;

    this._channel = channel;
  }

  timeout(ttl) {
    this.ttl = ttl;

    return this;
  }

  waitFor(key) {
    this.key = key;

    return this;
  }

  onResponse(handler) {
    this._handler = handler;

    return this;
  }

  call(done) {
    this._channel.send(this, done);
  }

  serialize() {
    return pick(this, [ 'id', 'dest', 'src', 'type', 'data', 'key' ]);
  }
}

module.exports = Command;
