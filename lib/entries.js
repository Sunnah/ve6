'use strict';

var pg = require('pg');

var DATABASE = 'postgres://postgres:Lovisa95@localhost/Users';

function createWritingOnTheWall(username, text, cb) {
  pg.connect(DATABASE, function (error, client, done) {
    if (error) {
      return cb(error);
    }

    var values = [username, text, new Date()];
    var query = 'INSERT into veggurinn (username, text, date) VALUES($1, $2, $3)';
    client.query(query, values, function (err, result) {
      done();

      if (err) {
        console.error(err);
        return cb(err);
      } else {
        return cb(null, true);
      }
    });
  });
}


module.exports.listWriting = function listWriting (cb) {
  pg.connect(DATABASE, function (error, client, done) {
    if (error) {
      return cb(error);
    }

    var query = 'SELECT * FROM veggurinn ORDER BY date DESC LIMIT 10';
    client.query(query, function (err, result) {
      done();

      if (err) {
        return cb(error);
      } else {
        return cb(null, result.rows);
      }
    });
  });
};
module.exports.createEntry = function createEntry (username, entrytext, cb) {
  createWritingOnTheWall(username,entrytext,cb);
}


