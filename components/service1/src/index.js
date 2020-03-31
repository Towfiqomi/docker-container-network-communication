/*  eslint linebreak-style: ["error", "windows"]  */
/* eslint-env es6 */
/*  eslint max-len: ["error", { "code": 280 }]*/

'use strict';
const express = require('express');
const app = express();
const expressip = require('express-ip');
const request = require('request');
const bodyParser = require('body-parser');
// eslint-disable-next-line camelcase
const {fibonacci_series} = require('../modules/fibonacci.js');
const Docker = require('dockerode');
const fs = require('fs');

// Docker connection configuration
// const dockerHostIP = '192.168.65.2';
// const dockerHostPort = 4243;
// const docker = new Docker({host: dockerHostIP, port: dockerHostPort});
// const options = {
//  protocol: 'tcp',
//   host: '127.0.0.1',
//  port: 2375,
// };

// const docker = new Docker(options);

const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const docker = new Docker(socket);

const PORT = 8001;
const HOST = '0.0.0.0';


//  JSON body-parser configuration
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(expressip().getIpInfoMiddleware);

// Api endpoint for checking the service availability
app.get('/', function(req, res) {
  res.send('Hello From Service One');
  res.status(200);
});


// Setting response of for the incoming get request to the root path
app.get('/getStatus', (req, res) => {
  // Response to the get request in the root path
  console.log('Response from service1');
  console.log('========================');
  console.log('Hello from' + req.connection.remoteAddress + ':' + req.connection.remotePort + ' to' + req.connection.localAddress + ':' + req.connection.localPort);
  console.log('');
  //  Sending HTTP get resuest as promise to the service 2 container
  return new Promise((resolve, reject) => {
    request('http://app-service2:8000/res', {json: true}, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    });
  })
      .then((response) => {
        // receiving the response from service 2 as JSON
        // Generating the formatted console output from the JSON data
        console.log('Response from service2 as a result of a incoming request from service1');
        console.log('===============================================================');
        console.log('Hello from ' + response.remoteIp + ':' + response.remotePort + 'to' + response.localIP + ':' + response.localPort)
        res.json({
          service1: {
            remote: `Hello from ${req.connection.remoteAddress}:${req.connection.remotePort}`,
            local: `to ${req.connection.localAddress}:${req.connection.localPort}`
          },
          service2: response,
        });
      })
      .catch((error) => {
        console.log('Error');
        res.send(error);
      });
});

// Api to return the fibonacci series
app.post('/fibo', (req, res) => {
  const number = req.body.number;
  let message;
  if (number < 0) {
    message = 'Error: negative number';
    res.status(400).send({error: message});
  }
  if (isNaN(number)) {
    message = 'Error: not a number';
    res.status(400).send({error: message});
  }
  const fiboSeries = fibonacci_series(req.body.number);
  res.status(200).send({fibo: fiboSeries});
});

// Api to return the start and shutdown logs of services
app.get('/run-log', (req, res) => {
  fs.readFile('logs/activity/activity.json', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
    res.send(data);
  });
});

// Api to shutdown the services docker containers
app.post('/shutdown', (req, res) => {
  const service2Container = docker.getContainer('app-service2');
  service2Container.stop(function(err, data1) {
    fs.appendFile('logs/activity/activity.json', '\n Service2: SHUTDOWN ' + new Date().toJSON(), (err) => {
      if (err) throw err;
      console.log('End time added to logger');
    });
  });

  const service1Container = docker.getContainer('app-service1');
  service1Container.stop(function(err, data2) {
    fs.appendFile('logs/activity/activity.json', '\n Service1: SHUTDOWN ' + new Date().toJSON(), (err) => {
      if (err) throw err;
      console.log('End time added to logger');
    });
    res.send('Services shutdown complete');
  });
});

// Server shutdown detection either via exception or kill command
const exceptionOccured = false;

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  exceptionOccured = true;
  process.exit();
});

process.on('exit', function(code) {
  if (exceptionOccured) console.log('Exception occured');
  else {
    fs.appendFile('logs/activity/activity.json', '\n Service1: SHUTDOWN ' + new Date().toJSON(), (err) => {
      if (err) throw err;
      console.log('End time added to logger');
    });
  };
});

process.on('SIGINT', function() {
  fs.appendFile('logs/activity/activity.json', '\n Service1: SHUTDOWN ' + new Date().toJSON(), (err) => {
    if (err) throw err;
    console.log('End time added to logger');
    process.exit();
  });
});

// service1 server configuration
const server = app.listen(PORT, function() {
  console.log(`Service one is Running on http://${HOST}:${PORT}`);
  fs.appendFile('logs/activity/activity.json', '\n Service1: BOOT ' + new Date().toJSON(), (err) => {
    if (err) throw err;
    console.log('start time added to logger');
  });
});

// function that closes the server
exports.closeServer = function() {
  server.close();
};
