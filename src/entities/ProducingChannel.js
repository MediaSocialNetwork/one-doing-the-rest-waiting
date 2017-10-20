const Channel = require('./Channel');
const Message = require('./Message');

class ProducingChannel extends Channel {
  static create(props) {
    return new ProducingChannel(props);
  }

  constructor(props) {
    super(props);

    this._sentCommands = {};

    this._listen(`channel:${this.id}:inbox`, this._handleResponse.bind(this));
  }

  _handleResponse(data) {
    let message = this._sentCommands[data.id];
    this._sentCommands[data.id] = null;

    if (message) {
      message._handler(Message.create(data).value);
    }
  }

  bindTo(id) {
    this._bind = id;

    return this;
  }

  request(type, data, config) {
    return Message.from({
      channel: this,
    }, {
      dest: `channel:${this._bind}:inbox`,
      src: `channel:${this.id}:inbox`
    }, {
      type,
      data,
      config
    });
  }

  send(message) {
    super._send(message, job => {
      this._sentCommands[message.id] = message;
    });
  }
}

module.exports = ProducingChannel;
