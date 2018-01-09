var TAG = 'app.js';

var express = require('express');
var app = express();
var path = require('path');
var env = require('./Environment/env.js').env;

var bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    limit: '20mb',
    extended: true
}));

var dbConfig = require('./Environment/mongoDatabase.js');

var crawl = require('./crawl.js');
app.use('/crawl', crawl);

dbConfig.createMongoConn(function(error) {
    if (error) {
        console.log('Unable to connect to the mongoDB server. Error:', error);
    } else {

        app.listen(8083);
        console.log('Listening on port 8083');
    }

})