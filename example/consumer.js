const consumer = require('../src').createConsumer({
  prefix: 'example:'
});

consumer.register(channel => {
  console.log('registerConsumer', channel.id);

  channel.onRequest((request, done) => {
    console.log('onRequest', request);

    // do somthing
    setTimeout(() => {
      done({
        repsonseTime: Date.now()
      });
    }, 5e3);
  });
});
