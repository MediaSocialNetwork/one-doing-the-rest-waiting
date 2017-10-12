const kue = require('kue');

class Producer {
  static create(props) {
    return new Producer(props);
  }

  constructor(props) {
    this._queue = kue.createQueue();
  }

  lookForConsumer(done, interval = 1000) {
    this._queue
      .create('request-channel')
      .on('complete', channel => {
        done(channel);
      })
      .on('failed', err => {
        // retry
        setTimeout(
          this.lookForConsumer.bind(this, done, interval),
          interval
        );
      })
      .save();
  }
}

module.exports = Producer;
