(function () {

    var http = require('http');
    var mongo = require('./database');
    var config = require('./config');

    var connectionUrl = config.mongodb;

    var updateDetails = function (id, url, collectionName, check) {
        http.get(url, function (res) {
            res.on('data', function (responseData) {
                var observation = JSON.parse(responseData).current_observation;
                if (observation) {
                    mongo.update(connectionUrl, collectionName, { _id: id }, { details: observation }, function (db, reply) {
                        db.close();
                        check();
                    });
                }
                else {
                    check();
                }
            });
        });
    };

    exports.setup = function (setupComplete) {
        
        var collectionName = 'locations';
        var data = config.data;

        mongo.drop(connectionUrl, collectionName, function (db, reply) {

            if (reply)
                console.log('"' + collectionName + '" dropped');

            mongo.insertMany(connectionUrl, collectionName, data, function (db, reply) {
                console.log(reply.insertedCount + ' record(s) inserted to "' + collectionName + '"' );
                db.close();
                setupComplete();
            });

        });

    };

    exports.refresh = function (refreshComplete) {
        var collectionName = 'locations';
        mongo.get(connectionUrl, collectionName, {}, function (db, data) {

            var totalRecords = data.length;
            var completedRecords = 0;

            for (var i = 0; i < totalRecords; i++) {
                updateDetails(data[i]._id, data[i].url, collectionName, function () {
                    completedRecords++;
                    if (totalRecords === completedRecords)
                        refreshComplete();
                });
            }
        });
    };

    exports.get = function (filter, getComplete) {

        mongo.get(connectionUrl, 'locations', filter, function (db, data) {
            getComplete(data);
        });

    };

})();