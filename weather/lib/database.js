(function () {
    var db = require('mongodb').MongoClient;

    exports.drop = function (url, collectionName, done) {

        db.connect(url, function (err, db) {

            db.collection(collectionName).drop(function (err, reply) {
                done(db, reply);
            });

        });

    };

    exports.get = function (url, collectionName, filter, populate) {
        
        db.connect(url, function (err, db) {
            var list = db.collection(collectionName)
                         .find(filter)
                         .toArray(function (err, data) {
                             populate(db, data);
                         });
        });

    };

    exports.insertMany = function (url, collectionName, data, done) {

        db.connect(url, function (err, db) {

            db.collection(collectionName).insertMany(data, function (err, reply) {
                done(db, reply);
            });

        });

    };

    exports.insertOne = function (url, collectionName, data, done) {

        db.connect(url, function (err, db) {

            db.collection(collectionName).insertOne(data, function (err, reply) {
                done(db, reply);
            });

        });

    };

    exports.update = function (url, collectionName, criteria, data, done) {

        db.connect(url, function (err, db) {

            db.collection(collectionName).findOneAndUpdate(criteria, { $set: data }, function (err, reply) {
                done(db, reply);
            });

        });

    };

})();