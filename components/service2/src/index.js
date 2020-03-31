/*  eslint linebreak-style: ["error", "windows"]  */
/* eslint-env es6 */
/*  eslint max-len: ["error", { "code": 280 }]*/

'use strict';

const express = require('express');
const PORT = 8000;
const HOST = '0.0.0.0';
const app = express();
const fs = require('fs');

// Sample get request response for testing
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Checking Service2's response to incoming get request from service1
app.get('/res', (req, res) => {
  // FIxing the express ip hash generation issue
  let remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  remoteIp = remoteIp.replace('::ffff:', '');

  let localIp = req.headers['x-forwarded-for'] || req.connection.localAddress;
  localIp = localIp.replace('::ffff:', '');

  // sending the JSON data to service1 as a response
  res.status(200).json({
    remoteIp: remoteIp,
    remotePort: req.client.remotePort,
    localIP: localIp,
    localPort: req.client.localPort,
  });
});

app.get('/run-log', (req, res) => {
  fs.readFile('logs/activity/activity.json', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
    res.send(data);
  });
});


const exceptionOccured = false;


process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  exceptionOccured = true;
  process.exit();
});

process.on('exit', function(code) {
  if (exceptionOccured) console.log('Exception occured');
  else {
    fs.appendFile('logs/activity/activity.json', '\n Service2: SHUTDOWN ' + new Date().toJSON(), (err) => {
      if (err) throw err;
      console.log('End time added to logger');
    });
  }
});

process.on('SIGINT', function() {
  fs.appendFile('logs/activity/activity.json', '\n Service2: SHUTDOWN ' + new Date().toJSON(), (err) => {
    if (err) throw err;
    console.log('End time added to logger');
    process.exit();
  });
});

const server = app.listen(PORT, function() {
  console.log(`Service two is Running on http://${HOST}:${PORT}`);
  fs.appendFile('logs/activity/activity.json', '\n Service2: BOOT ' + new Date().toJSON(), (err) => {
    if (err) throw err;
    console.log('start time added to logger');
  });
});

exports.closeServer = function() {
  server.close();
};
