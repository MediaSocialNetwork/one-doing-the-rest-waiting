const Channel = require('./Channel');

class IncomeChannel extends Channel {
  static create(props) {
    return new IncomeChannel(props);
  }

  constructor(props) {
    super(props);

    this._listenIncomeCommand();
  }

  _listenIncomeCommand() {

  }

  onRequest(cb) {
    this.onRequest = cb;
  }
}

module.exports = IncomeChannel;
