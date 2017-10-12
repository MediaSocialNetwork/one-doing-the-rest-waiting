const express = require('express');
const nocache = require('nocache');

const producer = require('../src').Producer.create();

const app = express();
const port = 3002;

app.use(nocache())
app.get('/:key', (req, res, next) => {
  let { key } = req.params;

  res.json({
    key
  });

  // RPC with message identified by {key}
  // other RPCs later with same key will wait until first RPC finish

  // interface
  let channel = app.get('rpc');

  channel
    .command('download', {
      data: {
        key
      }
    })
    .timeout(1e3)
    .waitFor(key)
    .onResponse(response => {
      console.log(response);
    })
    .call();
});

producer.lookForConsumer(channel => {
  console.log('lookForConsumer', channel.id);

  app.set('rpc', channel);
});

// app.listen(port, () => console.log(`Producer started at :${port}`));
