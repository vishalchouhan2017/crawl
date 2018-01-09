var express = require('express');
var app = express();
var fs = require('fs');

var fun = require('./function.js');

app.get('/fbData', function(req, res) {
    var callback = function(err, regres) {
        res.statusCode = regres.http_code;
        res.json(regres);
    };
    fun.fb(req, callback);
});

app.get('/youTubeData', function(req, res) {
    var callback = function(err, regres) {
        res.statusCode = regres.http_code;
        res.json(regres);
    };
    fun.youTube(req, callback);
});


app.get('/downloadFbExcel', function(req, res) {
    var callback = function(err, regres) {
        res.statusCode = regres.http_code;
        res.download(regres.message, function(){
                    fs.unlinkSync(regres.message);
                });
    };
    fun.downloadFbExcel(req, callback);
});

app.get('/downloadYoutubeExcel', function(req, res) {
    var callback = function(err, regres) {
         res.statusCode = regres.http_code;
        res.download(regres.message, function(){
                    fs.unlinkSync(regres.message);
                });
    };
    fun.downloadYouTubeExcel(req, callback);
});
module.exports = app;