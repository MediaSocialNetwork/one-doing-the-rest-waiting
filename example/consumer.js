const consumer = require('../src').createConsumer({
  prefix: 'example:'
});

consumer.register(channel => {
  console.log('registerConsumer', channel.id);

  channel.onRequest((command, done) => {
    console.log('onRequest', command);

    // do somthing
    setTimeout(() => {
      done({
        repsonseTime: Date.now()
      });
    }, 5e3);
  });
});
