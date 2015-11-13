'use strict';

var express = require('express');
var router = express.Router();

router.get('/radio', function(req, res, next) {
  res.render('radio', { title: 'Radio buttons' });
});

router.post('/radio', function (req, res, next) {
  var selected = req.body.radio;

  res.render('radio', { selected: selected });
});


module.exports = router;
