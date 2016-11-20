(function () {

    var mongo = require('./database')
    var config = require('./config');
    var cache = require('./cache');
    var formatter = require('./formatter');

    var connectionUrl = config.mongodb;

    exports.index = function (req, res) {

        var sort = req.query.sort;
        if (!sort)
            sort = 'id';

        var now = new Date();

        cache.get({}, sort, function (data) {
            res.render('index', { today: formatter.formatDate(now), locations: data });
        });

    };

})();