#!/usr/bin/env node
var restaurants = ['aallokko', 'alvari', 'cafe-libri', 'lozzi',
    'musica', 'piato', 'wilhelmiina', 'hestia',
    'kvarkki', 'ylisto', 'novelli', 'normaalikoulu'];
var apiPrefix = 'api';
var baseUrl = 'http://www.sonaatti.fi/';

var restify = require('restify');
var io = require('node.io');

// TODO: --serve
foodToday(baseUrl + 'piato', function(d) {console.log(d);});
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

function foodToday(url, done) {
    var job = new io.Job({
        input: false,
        run: function() {
           this.getHtml(url, function(err, $) {
                if (err) throw err;

                var $p = $('.listapaikka');
                var ret = [];
                $('.ruuat p', $p).each(function(k) {
                    ret.push({food: k.text});
                });

                $('.hinnat', $p).text.split('\n').forEach(function(k, i) {
                    ret[i].price = k;
                }); 

                ret = ret.filter(function(k) {
                    return k.food && k.price;
                });

                this.emit(ret);
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
}

/*
// other days
$('.lista .ruuat p').each(function(k) {
    console.log(k.text);
    // TODO: split by ,
});
*/

