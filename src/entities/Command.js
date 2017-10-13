const pick = require('object.pick');
const uuid = require('uuid');

class Command {
  static create(props) {
    return new Command(props);
  }

  constructor({ id, channel, dest, src, type, data, config = {} }) {
    this.id = id || uuid.v4();

    this.dest = dest;
    this.src = src;
    this.type = type;
    this.data = data;
    this.config = config;

    this._channel = channel;
  }

  ttl(ttl) {
    this.config.ttl = ttl;

    return this;
  }

  waitFor(key) {
    this.config.waitFor = key;

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
    return pick(this, [ 'id', 'dest', 'src', 'type', 'data', 'config' ]);
  }

  get key() {
    return this.config.waitFor || this.id;
  }
}

module.exports = Command;
