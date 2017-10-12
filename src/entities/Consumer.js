const kue = require('kue');
const uuid = require('uuid');

const IncomeChannel = require('./IncomeChannel');

class Consumer {
  static create(props) {
    return new Consumer(props);
  }

  constructor(props) {
    this._queue = kue.createQueue();

    this._queue.process('request-channel', this._provideChannel.bind(this));
  }

  register(callback) {
    this._registration = {
      channel: IncomeChannel.create({
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
