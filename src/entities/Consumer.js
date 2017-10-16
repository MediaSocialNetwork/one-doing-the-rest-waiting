const kue = require('kue');
const uuid = require('uuid');

const ConsumingChannel = require('./ConsumingChannel');

class Consumer {
  static create(props) {
    return new Consumer(props);
  }

  constructor(props = {}) {
    this._queue = kue.createQueue(props.redis);
    this._prefix = props.prefix || '';

    this._queue.process(`${this._prefix}request-channel`, this._provideChannel.bind(this));
  }

  register(callback) {
    this._registration = {
      channel: ConsumingChannel.create({
        prefix: this._prefix,
        queue: this._queue
      }),
      callback: callback
    };
  }

  _provideChannel(job, done) {
    if (!this._registration) {
      done(new Error('No channel registered'));
      return;
    }

    let { callback, channel } = this._registration;

    callback(channel);

    done(null, channel.id);
  }
}

module.exports = Consumer;
