#!/usr/bin/env node
var restaurants = ['aallokko', 'alvari', 'cafe-libri', 'lozzi',
    'musica', 'piato', 'wilhelmiina', 'hestia',
    'kvarkki', 'ylisto', 'novelli', 'normaalikoulu'];
var apiPrefix = 'api';
var baseUrl = 'http://www.sonaatti.fi/';

var restify = require('restify');
var io = require('node.io');
var scraper = require('../lib/scraper');

// TODO: --serve
scraper.foodToday(baseUrl + 'piato', function(d) {console.log(d);});
// main();

function main() {
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
