const kue = require('kue');
const uuid = require('uuid');

class Consumer {
  static create(props) {
    return new Consumer(props);
  }

  constructor(props) {
    this._queue = kue.createQueue();

    this._queue.process('request-channel', this._provideChannel.bind(this));
  }

  register(registration) {
    this._registration = registration;
  }

  _provideChannel(job, done) {
    if (!this._registration) {
      done(new Error('No channel registered'));
      return;
    }

    let channel = { id: uuid.v4() };

    this._registration(channel);

    done(null, channel);
  }
}

module.exports = Consumer;
