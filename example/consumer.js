const rpc = require('../src');

rpc.registerConsumer(channel => {
  channel.onRequest((command, done) => {
    // do somthing
    setTimeout(() => {
      done();
    }, 1e3);
  });
});
