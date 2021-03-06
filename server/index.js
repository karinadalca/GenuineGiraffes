var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var axios = require('axios');
var database = require('../database/index.js');
var Sequelize = require('sequelize');

var app = express();
app.use(bodyParser.json());
app.use( bodyParser.urlencoded({ extended: true }) );

app.use(express.static(__dirname + '/../react-client/'));



const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});