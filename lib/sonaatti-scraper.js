#!/usr/bin/env node
var restaurants = ['piato']; // ['aallokko' 'alvari', 'cafe-libri', 'lozzi',
    // 'musica', 'piato', 'wilhelmiina', 'hestia',
    // 'kvarkki', 'ylisto', 'novelli', 'normaalikoulu'];
var apiPrefix = 'api';
var baseUrl = 'http://www.sonaatti.fi/';

var restify = require('restify');
var io = require('node.io');

function respond(req, res, next) {
    res.send(foodToday());
}

var server = restify.createServer();
restaurants.forEach(function(restaurant) {
    server.get('/' + apiPrefix + '/' + restaurant + '/today', function(req, res) {
        foodToday(baseUrl + restaurant, function(data) {
            res.send(data);
        });
    })
    // TODO: specific days
});

server.listen(8000, function() {
    console.log('%s listening at %s', server.name, server.url);
});

function foodToday(url, done) {
    var job = new io.Job({
        input: false,
        run: function() {
           this.getHtml(url, function(err, $) {
                if (err) throw err;

                var foods = [];
                $('.listapaikka .ruuat p').each(function(k) {
                    foods.push(k.text);
                });
                this.emit(foods);
            });
        }
    });

    io.start(
        job,
        {},
        function(err, output) {
            if (err) throw err;

            done(output);
        },
        true
    );

    /*
    return [
        {
            type: 'sausage',
            price: 3.2
        },
        {
            type: 'porridge',
            price: 2
        },
    ];*/
}

/*
require('node.io').scrape(function() {
    this.getHtml(url, function(err, $) {
        if (err) throw err;

        // today's food
        $('.listapaikka .ruuat p').each(function(k) {
            console.log(k.text);
            // TODO: filter out empty
        });

        // other days
        $('.lista .ruuat p').each(function(k) {
            console.log(k.text);
            // TODO: split by ,
        });
    });
});
*/

