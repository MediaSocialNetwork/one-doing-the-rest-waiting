const debug = require('debug')('odtrw');
const kue = require('kue');

const ProducingChannel = require('./ProducingChannel');

class Producer {
  static create(props) {
    return new Producer(props);
  }

  constructor(props) {
    console.log(props);
    this._queue = kue.createQueue(props);
  }

  discover(done, interval = 1000) {
    this._queue
      .create(`request-channel`)
      .ttl(interval)
      .on('complete', consumerChannelId => {
        let channel = ProducingChannel.create({
          queue: this._queue
        }).bindTo(consumerChannelId);

        done(channel);
      })
      .on('failed', err => {
        // retry
        debug(`Discovery again in ${interval}ms`);
        this.retry(done, interval);
      })
      .save();
  }

  retry(done, interval) {
    setTimeout(
      this.discovery.bind(this, done, interval),
      interval
    );
  }
}

module.exports = Producer;
