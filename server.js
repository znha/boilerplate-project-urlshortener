'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const dns = require('dns');


var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
//process.env.DB_URI
mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
var { Schema } = mongoose;
var myUrlSchema = Schema({
  original: String,
  newUrl: String
});
var urlModel = mongoose.model('url', myUrlSchema);
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl/new', function (req, res) {
  var url = req.body.url;
  console.log
  const options = {
    family: 6,
    hints: dns.ADDRCONFIG | dns.V4MAPPED,
  };
  options.all = true;
  dns.lookup(new URL(url).hostname, async function (err, addresses) {
    if (err) {
      res.json({ "error": "invalid URL" });
    } else {
      var newUrl = Math.floor(Math.random() * Math.floor(1000));
      var myUrl = new urlModel({
        original: url,
        newUrl: newUrl
      });
      await myUrl.save(function (err, data) {
        if (err) {
          res.json({ "error": "invalid URL" });
        }
        res.json({ "original_url": url, "short_url": newUrl });
      });
    }
  });


});
app.listen(port, function () {
  console.log('Node.js listening ...');
});
