var io = require('node.io');

exports.foodToday = function(url, done) {
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

