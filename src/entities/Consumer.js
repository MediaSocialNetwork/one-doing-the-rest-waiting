const kue = require('kue');
const uuid = require('uuid');

class Consumer {
  static create(props) {
    return new Consumer(props);
  }

  constructor(props) {
    this._queue = kue.createQueue();
    this._waitingList = [];

    this._queue.process('request-channel', this._provideChannel.bind(this));
  }

  register(registration) {
    this._waitingList.push(registration);
  }

  _provideChannel(job, done) {
    let registration = this._waitingList.pop();

    if (!registration) {
      done(new Error('No channel registered'));
      return;
    }

    let channel = { id: uuid.v4() };

    registration(channel);

    done(null, channel);
  }
}

module.exports = Consumer;
