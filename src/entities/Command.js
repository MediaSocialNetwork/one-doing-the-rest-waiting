const pick = require('object.pick');

class Command {
  static create(props) {
    return new Command(props);
  }

  constructor({ name, data, channel }) {
    this.name = name;
    this.data = data;
    this._channel = channel;
  }

  timeout(duration) {
    this.timeout = duration;

    return this;
  }

  waitFor(key) {
    this.key = key;

    return this;
  }

  onResponse(cb) {
    this.onResponse = cb;

    return this;
  }

  call(done) {
    this._channel.send(this, done);
  }

  serialize() {
    return pick(this, [ 'name', 'data', 'key' ]);
  }
}

module.exports = Command;
