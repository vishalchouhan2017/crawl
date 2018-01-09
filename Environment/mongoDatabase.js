var TAG = 'mongoDatabase.js';
var mongoClient = require('mongodb').MongoClient;
var async = require('async');

var env = require('./env.js').env;
console.log(TAG + " " + "Deployment Environment is: " + env);

// var dbConfig = {
//     "loc": {
//         "type": "singleInstance",
//         "user": "",
//         "pwd": "",
//         "mongod": ["127.0.0.1:27017"],
//         "database": "myDB"
//     }
// };

// var connParams = null;

// connParams = dbConfig.loc;

// var mongod = connParams.mongod;

// var databaseURL = null;
// var mongoDbConn = null;

// var hosts = null;
// for (var i = 0; i < mongod.length; i++) {
//     if (i === 0) {
//         hosts = mongod[0];
//     } else {
//         hosts = hosts + ',' + mongod[i];
//     }
// }

// var dbConnUrl = null;
// var dbConnUrlSecondary = null;
// if (!(connParams.user === "" && connParams.pwd === "")) {
//     dbConnUrl = 'mongodb://' + connParams.user + ':' + connParams.pwd + '@' + hosts + '/' + connParams.database;
// } else {
//     dbConnUrl = 'mongodb://' + hosts + '/' + connParams.database;
// }


exports.createMongoConn = function(callback) {
    async.parallel([
            function(asyncCallback) {
                mongoClient.connect('mongodb://127.0.0.1:27017/myDB', function(err, database) {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        console.log('Connection established to: ', 'mongodb://127.0.0.1:27017/myDB');
                        // console.log(database);
                        exports.mongoDbConn = database;
                        asyncCallback(false);
                    }
                });
            },
        ],
        function(err, results) {
            if (err) {
                console.log('Error connecting to DB. Err : \n' + err.stack);
            } else {
                console.log('DB connection successfull.');
                callback(false);
            }
        });
}