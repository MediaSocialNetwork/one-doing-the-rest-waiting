const kue = require('kue');

const OutcomeChannel = require('./Channel');

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
      .on('complete', data => {
        let props = Object.assign(data, {
          queue: this._queue
        });

        let channel = OutcomeChannel.create(props);

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
