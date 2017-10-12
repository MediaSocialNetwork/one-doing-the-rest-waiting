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

  register(registration) {
    this._registration = registration;
  }

  _provideChannel(job, done) {
    if (!this._registration) {
      done(new Error('No channel registered'));
      return;
    }

    let channel = IncomeChannel.create({
      id: uuid.v4(),
      queue: this._queue
    });

    this._registration(channel);

    done(null, channel.serialize());
  }
}

module.exports = Consumer;
