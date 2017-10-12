const consumer = require('../src').Consumer.create();

consumer.register(channel => {
  console.log('registerConsumer', channel.id);

  channel.onRequest((command, done) => {
    console.log('onRequest', command);

    // do somthing
    setTimeout(() => {
      done('hahaha');
    }, 5e3);
  });
});
