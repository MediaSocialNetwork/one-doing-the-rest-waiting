const express = require('express');
const nocache = require('nocache');

const rpc = require('../src');

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
  rpc
    .create({
      command: 'download',
      data: {
        key
      }
    })
    .timeout(1e3)
    .waitFor(key)
    .onRespond(response => {
      console.log(response);
    })
    .call();
});

app.listen(port, () => console.log(`Producer started at :${port}`));
