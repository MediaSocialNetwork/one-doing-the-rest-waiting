const Command = require('./Command');

class Channel {
  command() {
    return Command.create();
  }

  onRequest(cb) {
    this.onRequest = cb;
  }
}
