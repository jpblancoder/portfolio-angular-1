/* global require */

var express = require('express');
var app = express();
var dist = '/www';

var www = express.static(__dirname + dist); // jshint ignore:line
app.use('/', www);

var port = 8888;
app.listen(port);

console.log("Booting http://localhost:" + port);
