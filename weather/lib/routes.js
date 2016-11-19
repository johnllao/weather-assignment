(function () {

    var mongo = require('./database')
    var config = require('./config');
    var cache = require('./cache');
    var formatter = require('./formatter');

    var connectionUrl = config.mongodb;

    exports.index = function (req, res) {
        var now = new Date();

        cache.get({}, function (data) {
            res.render('index', { today: formatter.formatDate(now), locations: data });
        });

    };

})();