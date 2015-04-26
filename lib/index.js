'use strict';
var Hapi = require('hapi');
var server = new Hapi.Server();
var internals = {};

server
    .connection({
        host: 'localhost',
        port: 8000
    })
    .route({
        method: 'GET',
        path: '/hello',
        handler: function(request, reply) {
            reply('hello world');
        }
    });

server.start(function() {
    console.log('Server running at:', server.info.uri);
});