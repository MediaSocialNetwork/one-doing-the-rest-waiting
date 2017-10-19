const debug = require('debug')('odtrw');
const kue = require('kue');

const ProducingChannel = require('./ProducingChannel');

class Producer {
  static create(props) {
    return new Producer(props);
  }

  constructor(props = {}) {
    this._queue = kue.createQueue(props.kue);
    this._prefix = props.prefix || '';
  }

  discovery(done, interval = 1000) {
    this._queue
      .create(`${this._prefix}request-channel`)
      .ttl(interval)
      .on('complete', consumerChannelId => {
        let channel = ProducingChannel.create({
          prefix: this._prefix,
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
