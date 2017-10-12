const Channel = require('./Channel');
const Command = require('./Command');

class OutcomeChannel extends Channel {
  static create(props) {
    return new OutcomeChannel(props);
  }

  constructor(props) {
    super(props);
  }

  command(name, data) {
    return Command.create({
      name,
      data,
      channel: this
    });
  }

  send(command, done) {
    this._queue
      .create(`channel:${this.id}:command`, command.serialize())
      .save(done);
  }
}

module.exports = OutcomeChannel;
