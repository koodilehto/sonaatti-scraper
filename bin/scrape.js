#!/usr/bin/env node
var VERSION = '0.1.0';

var restaurants = ['aallokko', 'alvari', 'cafe-libri', 'lozzi',
    'musica', 'piato', 'wilhelmiina', 'hestia',
    'kvarkki', 'ylisto', 'novelli', 'normaalikoulu'];
var apiPrefix = 'api';
var baseUrl = 'http://www.sonaatti.fi/';

var restify = require('restify');
var io = require('node.io');
var scraper = require('../lib/scraper');

var program = require('commander');

program.
    version(VERSION).
    option('-o --output <output>', 'output file, if not provided uses stdout').
    option('-s --serve', 'serve API').
    option('-p --port', 'server port').
    option('-r --restaurant', 'pick one of these: ' + restaurants.join(', ')).
    option('--silent', 'silent if file output is used').
    parse(process.argv);

main(program);

//scraper.foodToday(baseUrl + 'piato', function(d) {console.log(d);});

function main(p) {
    console.log(p);
}

function serve() {
    function respond(req, res, next) {
        res.send(foodToday());
    }

    var server = restify.createServer();
    restaurants.forEach(function(restaurant) {
        server.get('/' + apiPrefix + '/' + restaurant + '/today', function(req, res) {
            foodToday(baseUrl + restaurant, function(data) {
                res.send(data);
            });
        });
        // TODO: specific days
    });

    server.listen(8000, function() {
        console.log('%s listening at %s', server.name, server.url);
    }); 
}
