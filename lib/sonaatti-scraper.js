#!/usr/bin/env node
var url = 'http://www.sonaatti.fi/piato';

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

