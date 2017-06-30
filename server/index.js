var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var rp = require('request-promise');
var axios = require('axios');
var database = require('../database/index.js');
var addBooktoLibrary = require('../database/index.js').addBooktoLibrary;
var Sequelize = require('sequelize');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../react-client/'));

app.post('/book/import', function (req, res) {
  res.status(200);

  // Options for Open Library API Call
  var openLibraryOptions = {
    method: 'GET',
    url: 'http://openlibrary.org/search.json',
    qs: {
      q: req.body.q,
      limit: 25
    }
  };

  // Open Library API Call
  rp(openLibraryOptions)
  .then(function (data) {
    // parse returned data, grab only data.doc array
    var titles = JSON.parse(data);
    titles = titles.docs;
    //console.log("OPEN LIBRARY API CALL ",titles);
    return titles;
  })
  .then(function (titles) {
    var titleList = [];
    titles.map((title) => {

      // Librivox API Call Options
      var query = ('%5E') + title.title_suggest.split(' ').join('%20');
      var librivoxOptions = {
        method: 'GET',
        url: 'https://librivox.org/api/feed/audiobooks/title/' + query + '?format=json',
      };

      console.log('https://librivox.org/api/feed/audiobooks/title/' + query + '?format=json');

      // Librivox API call
       rp(librivoxOptions)
       .then(function (data) {
        if (data !== "{\"error\":\"Audiobooks could not be found\"}"){
          console.log("LIBRIVOX DATA: ", data);
          res.send(data);
        }
      })
    });

    //console.log("TITLELIST OUTSIDE ",titelist);
    return titleList;
  })
  .then(function (titleList) {
    console.log('TITLE LIST ',titleList);
  });
});


app.post('/library', function(req, res) {
  const book = req.body.book;
  addBooktoLibrary(book)
    .then( () => {
      console.log('Book saved!')
    })
    .catch( (err) => {
      console.log('Error:', err);
      console.log('Book already exist in database')
    })

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});