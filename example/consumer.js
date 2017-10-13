const consumer = require('../src').createConsumer();

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
