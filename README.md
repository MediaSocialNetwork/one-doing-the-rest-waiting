OneDoingTheRestWaiting - ODTRW 1.0.5
=====
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]

`one-doing-the-rest-waiting` is a RPC helper using [Kue](https://www.npmjs.com/package/kue) package. It is made to handle long async tasks: first call is executed, other later calls will wait for repsonse of the first call.

# Installation
```bash
npm install one-doing-the-rest-waiting
```

# Example
```javascript
// producer.js
const rpc = require('one-doing-the-rest-waiting');
const producer = rpc.createProducer({
  prefix: 'example:' // prefix for Kue queue
});

producer.discovery(channel => {
  channel
    .request('very-long-async-task', {
      param1: 'your-param-1',
      param2: 'your-param-2'
    })
    // other tasks with same `your-task-identify` will wait for this request's response
    .waitFor('your-task-identify')
    // handle response
    .onResponse(response => {
      console.log('The task response: ', response);
    })
    .send(); // send your request
});
```

```javascript
// consumer.js
const rpc = require('one-doing-the-rest-waiting');
const consumer = rpc.createConsumer({
  prefix: 'example:' // prefix for Kue queue
});

consumer.register(channel => {
  channel.onRequest((message, done) => {
    // after a very long process, call done()
    setTimeout(() => {
      done({
        response: 'your-result'
      });
    }, 10e3);
  });
});
```

# APIs

## createProducer(config)
* `config` {Object}
  * `redis` {Object} redis config for Kue
  * `prefix` {String} prefix for queue names
* return: a `Producer` instance

Factory method to create a `Producer` instance

## createConsumer(config)
* `config` {Object}
  * `redis` {Object} redis config for Kue
  * `prefix` {String} prefix for queue names
* return: a `Consumer` instance

Factory method to create a `Consumer` instance

## producer.discovery(callback)
* `callback` {Function} with parameters
  * `channel` {ProducingChannel}

Find `Consumer` instance with same Kue config

## producingChannel.request(taskName, data, config)
* `taskName` {String}
* `data` {Object} - optional
* `config` {Object} - optional
  * `waitFor` {String} Task identify to make other tasks wait
  * `ttl` {Number} Time-to-live of this message (will be supported next version)
* return: a `Message` instance

## message.waitFor(taskIdentify)
* `taskIdentify`
* return: current `Message` instance

Sugar method to set `config.waitFor`

## message.onResponse(callback)
* `callback` {Function} with paremeters
  * `response` {Object}
* return: current `Message` instance

Register callback that handles request's response

## message.send()
Send the message

## consumer.register(callback)
Register a `Consumer` instance, let other `Producer`s find it, with same Kue config

## consumingChannel.onRequest(callback)
* `callback` {Function} with parameters
  * `request` {Object}
  * `done` {Function}

Register callback that handles requests

# License
[The MIT License](http://opensource.org/licenses/MIT)

[npm-url]: https://www.npmjs.com/package/one-doing-the-rest-waiting
[npm-image]: https://img.shields.io/npm/v/one-doing-the-rest-waiting.svg?style=flat
[downloads-image]: https://img.shields.io/npm/dm/one-doing-the-rest-waiting.svg?style=flat
