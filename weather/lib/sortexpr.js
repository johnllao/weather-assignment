(function () {

    var config = require('./config');

    var getSortExpression = function (property, done) {

        var sortProperties = config.sort;
        var expr = {};

        for (var i = 0; i < sortProperties.length; i++) {
            if (sortProperties[i].property === property) {
                var str = '{ "' + sortProperties[i].field + '" : 1 }';
                expr = JSON.parse(str);
                break;
            }
        }

        done(expr);
    };

    exports.get = getSortExpression;
})();