var express = require('express');
var app = express();
var fs = require('fs');

var fun = require('./function.js');

app.post('/fbData', function(req, res) {
    var callback = function(err, regres) {
        res.statusCode = regres.http_code;
        res.json(regres);
    };
    fun.fb(req, callback);
});

app.post('/youTubeData', function(req, res) {
    var callback = function(err, regres) {
        res.statusCode = regres.http_code;
        res.json(regres);
    };
    fun.youTube(req, callback);
});


app.post('/downloadFbExcel', function(req, res) {
    var callback = function(err, regres) {
        res.statusCode = regres.http_code;
        res.download(regres.message, function(){
                    fs.unlinkSync(regres.message);
                });
    };
    fun.downloadFbExcel(req, callback);
});

app.post('/downloadYoutubeExcel', function(req, res) {
    var callback = function(err, regres) {
         res.statusCode = regres.http_code;
        res.download(regres.message, function(){
                    fs.unlinkSync(regres.message);
                });
    };
    fun.downloadYouTubeExcel(req, callback);
});
module.exports = app;