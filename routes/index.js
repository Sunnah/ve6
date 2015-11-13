'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/foo', function (req, res, next) {
  var count = req.session.views['/foo'];
  res.send('You have viewed this page ' + count + ' times');
});

router.get('/error', function(req, res){
  // Caught and passed down to the errorHandler middleware
  throw new Error('borked!');
});

module.exports = router;
