﻿(function () {

    var http = require('http');
    var mongo = require('./database');
    var config = require('./config');
    var formatter = require('./formatter');
    var sortExpr = require('./sortexpr');

    var connectionUrl = config.mongodb;
    var apiKey = config.apiKey;

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

            mongo.insertMany(connectionUrl, collectionName, data, function (db, reply) {
                db.close();
                setupComplete();
            });

        });

    };

    exports.refresh = function (refreshComplete) {
        var collectionName = 'locations';
        mongo.get(connectionUrl, collectionName, {}, {}, function (db, data) {

            var totalRecords = data.length;
            var completedRecords = 0;

            for (var i = 0; i < totalRecords; i++) {

                var id = data[i]._id;
                var sourceUrl = data[i].url.replace('{apikey}', apiKey);

                updateDetails(id, sourceUrl, collectionName, function () {
                    completedRecords++;
                    if (totalRecords === completedRecords) {
                        console.log('weather data loaded');
                        refreshComplete();
                    }
                });
            }
        });
    };

    exports.get = function (filter, sort, getComplete) {

        sortExpr.get(sort, function (expr) {

            mongo.get(connectionUrl, 'locations', filter, expr, function (db, data) {
                getComplete(data);
            });

        });

    };

})();