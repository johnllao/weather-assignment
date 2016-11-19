﻿(function () {
    var express = require('express');
    var config = require('./lib/config');
    var routes = require('./lib/routes');
    var cache = require('./lib/cache');

    var app = express();

    cache.setup(function () {

        cache.refresh(function () {

            app.set('views', './views');
            app.set('view engine', 'jade');

            app.use(express.static('./public'));

            app.get('/', routes.index);

            var port = config.port;
            app.listen(port);

            console.log('started at port ' + port);
        });
    });

})();