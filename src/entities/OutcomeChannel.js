const Channel = require('./Channel');
const Command = require('./Command');

class OutcomeChannel extends Channel {
  static create(props) {
    return new OutcomeChannel(props);
  }

  constructor(props) {
    super(props);

    this._sentCommands = {};

    this._listen(`channel:${this.id}:inbox`, data => {
      let command = this._sentCommands[data.id];

      if (command) {
        this._sentCommands[data.id] = null;

        command._handler(Command.create(data));
      }
    });
  }

  bindTo(id) {
    this._bind = id;

    return this;
  }

  command(type, data, config) {
    let src = `channel:${this.id}:inbox`;
    let dest = `channel:${this._bind}:inbox`;

    return Command.create({
      channel: this,
      dest,
      src,
      type,
      data,
      config
    });
  }

  send(command) {
    super._send(command, job => {
      this._sentCommands[command.id] = command;
    });
  }
}

module.exports = OutcomeChannel;
