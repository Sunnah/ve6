'use strict';

var express = require('express');
var router = express.Router();
//var xss=require('xss');

var users = require('../lib/users');
var entries = require('../lib/entries');

router.get('/restricted', ensureLoggedinIn, index);
router.post('/restricted', tagOnTheWallHandler, Wall)
router.get('/login', redirectIfLoggedIn, login);
router.post('/login', loginHandler);
router.get('/logout', logout);
router.get('/create', createForm);
router.post('/create', createHandler);
var moment = require('moment');
moment.locale('is');

module.exports = router;

/** route middlewares **/

function createForm(req, res, next) {
  res.render('create', { title: 'Create user' });
}

function createHandler(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  // hér vantar *alla* villumeðhöndlun
  users.createUser(username, password, function (err, status) {
    if (err) {
      console.error(err);
    }

    var success = true;

    if (err || !status ||password===''||username==='') {
      success = false;
    }

    res.render('create', { title: 'Create user', post: true, success: success })
  });
}

function ensureLoggedinIn(req, res, next) {
  if (req.session.user) {
    next(); // köllum í næsta middleware ef við höfum notanda
  } else {
    res.redirect('/login');
  }
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session.user) {
    res.redirect('/redirect');
  } else {
    next();
  }
}
function Wall(req, res, next){
  res.render('wall',{title: 'Wall'});
}
function login(req, res, next) {
  res.render('login', { title: 'Login' });
}

function tagOnTheWallHandler(req, res, next){
  var text = req.body.text;
  var user = req.session.user;
  entries.createEntry(user.username, text, function (err, status) {
    if (err) {
      console.error(err);
    }

    var success = true;

    if (err || !status) {
      success = false;
    }
    index(req, res, next);
  });
}

function loginHandler(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  users.auth(username, password, function (err, user) {
    if (user) {
      req.session.regenerate(function (){
        req.session.user = user;
        res.redirect('/restricted');
      });
    } else {
      var data = {
        title: 'Login',
        username: username,
        error: true
      };
      res.render('login', data);
    }
  });
}

function logout(req, res, next) {
  // eyðir session og öllum gögnum, verður til nýtt við næsta request
  req.session.destroy(function(){
    res.redirect('/');
  });
}


function index(req, res, next) {
  var user = req.session.user;

  entries.listWriting(function (err, entryList) {
    users.listUsers(function (err, all) {
      entryList.forEach(function(e,i,a) {
          var time = moment(e.date).format('LLL');
          e.date = time;
        });
      res.render('restricted', { title: 'Restricted zone',
        user: user,
        users: all,
        entries: entryList
      });
    });
  });
}