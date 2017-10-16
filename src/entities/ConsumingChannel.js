const debug = require('debug')('odtrw');

const Channel = require('./Channel');
const Message = require('./Message');

class ConsumingChannel extends Channel {
  static create(props) {
    return new ConsumingChannel(props);
  }

  constructor(props) {
    super(props);
    this._pendingLists = {};

    this._listen(`${this.prefix}channel:${this.id}:inbox`, this._handleRequest.bind(this));
  }

  _handleRequest(message) {
    let pendingList = this._getPendingListByKey(message.key);

    pendingList.push(message);

    if (pendingList.length === 1) {
      this._handler(message.value, response => {
        this._replyForKey(message.key, response);
      });
    }
  }

  _getPendingListByKey(key) {
    if (!this._pendingLists[key]) {
      this._pendingLists[key] = [];
    }

    return this._pendingLists[key];
  }

  _replyForKey(key, response) {
    let pendingList = this._getPendingListByKey(key);

    debug(`sending response for ${pendingList.length} message(s) wait for ${key}`);

    pendingList.forEach(message => {
      this
        .response(`response:${message.type}`, {
          id: message.id,
          dest: message.src,
          src: message.dest,
          data: response
        })
        .call();
    })

    pendingList.length = 0;
  }

  response(type, data, config) {
    return Message.from({
      channel: this,
      type,
      config
    }, data);
  }

  onRequest(handler) {
    this._handler = handler;
  }

  send(message) {
    return super._send(message);
  }
}

module.exports = ConsumingChannel;
