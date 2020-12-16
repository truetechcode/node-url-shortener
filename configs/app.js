const express = require('express');
var cors = require('cors')

module.exports = function () {
  let server = express(),
    create,
    start;
  server.use(cors())

  create = (config) => {
    let routes = require('../routes');
    // set all the server things
    server.set('env', config.env);
    server.set('port', config.port);
    server.set('hostname', config.hostname);

    server.use(express.json({ limit: '50mb' }));
    server.use(express.urlencoded({ extended: true, limit: '50mb' }))

    // Set up routes
    routes.init(server);
  };


  start = () => {
    let hostname = server.get('hostname'),
      port = server.get('port');
    server.listen(port, function () {
      console.log('Express server listening on - http://' + hostname + ':' + port);
    });

  };
  return {
    create: create,
    start: start,
    server: server
  };
};