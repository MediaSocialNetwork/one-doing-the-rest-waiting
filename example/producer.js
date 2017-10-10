const express = require('express');
const nocache = require('nocache')

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
});

app.listen(port, () => console.log(`Producer started at :${port}`));
