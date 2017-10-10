class Command {
  static create() {
    return new Command();
  }

  constructor(props) {

  }

  timeout(duration) {
    this.timeout = duration;

    return this;
  }

  waitFor(key) {
    this.key = key;

    return this;
  }

  onResponse(cb) {
    this.onResponse = cb;

    return this;
  }

  call() {

  }
}

module.exports = Command;
