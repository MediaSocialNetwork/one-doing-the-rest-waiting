const kue = require('kue');

const OutcomeChannel = require('./OutcomeChannel');

class Producer {
  static create(props) {
    return new Producer(props);
  }

  constructor(props) {
    this._queue = kue.createQueue();
  }

  discovery(done, interval = 1000) {
    this._queue
      .create('request-channel')
      .on('complete', consumerChannelId => {
        let channel = OutcomeChannel.create({
          queue: this._queue
        }).bindTo(consumerChannelId);

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
