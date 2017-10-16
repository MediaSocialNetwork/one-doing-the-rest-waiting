const express = require('express');
const nocache = require('nocache');

const producer = require('../src').createProducer({
  prefix: 'example:'
});

const app = express();
const port = process.env.PORT || 3002;

app.use(nocache())
app.get('/favicon.ico', (req, res, next) => res.sendStatus(404));
app.get('/robots.txt', (req, res, next) => res.sendStatus(404));
app.get('/:hog', (req, res, next) => {
  let { hog } = req.params;

  // RPC with message identified by {key}
  // other RPCs later with same key will wait until first RPC finish

  // interface
  let channel = app.get('rpc');

  channel
    .request('download', {
      requestTime: Date.now()
    })
    .waitFor(hog)
    .onResponse(response => {
      res.json(response);
    })
    .call();
});

producer.discovery(channel => {
  console.log('discovery channel', channel._bind);

  app.set('rpc', channel);

  app.listen(port, () => console.log(`Producer started at :${port}`));
});
