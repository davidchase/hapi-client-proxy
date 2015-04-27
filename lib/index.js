'use strict';
var Hapi = require('hapi');
var rest = require('rest');
var server = new Hapi.Server();
var internals = {};

internals.url = 'http://www.filltext.com/?rows=100&id={index}&fname={firstName}&lname={lastName}' +
    '&tel={phone|format}&address={streetAddress}&city={city}&state={usState|abbr}&zip={zip}';

internals.mime = require('rest/interceptor/mime');
internals.errorCode = require('rest/interceptor/errorCode');
internals.client = rest.wrap(internals.mime).wrap(internals.errorCode);
internals.handlerFn = function handlerFn(request, reply) {
    internals
        .client({
            path: internals.url
        })
        .then(function(response) {
            reply.view('layout', {
                data: response.entity
            })
        })
        .catch(function(err) {
            console.log('oopps', err);
        });
};

server
    .connection({
        host: 'localhost',
        port: 8000
    })
    .route({
        method: 'GET',
        path: '/',
        handler: internals.handlerFn
    });

server.views({
    engines: {
        hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layout',
    partialsPath: './views/partials'
});

server.start(function() {
    console.log('Server running at:', server.info.uri);
});