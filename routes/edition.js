var express = require('express');
var router = express.Router();
const mariadb = require('mariadb');
const dotenv = require('dotenv');
dotenv.config();

const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: process.env.MariaUser,
  password: process.env.MariaPassword,
  connectionLimit: 5
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('edition', {
    title: 'The World News::'
  });
});

router.post('/save', function(req, res, next) {
  let body = req.body;
  let author = body.author;
  let date = body.date;
  let title = body.title;
  let section = body.section;
  let status = body.status;
  let text = body.text;
  pool.getConnection()
    .then(conn => {
      conn.query("USE TP3")
        .then((rows) => {
          return conn.query('INSERT INTO articles (author, date, title, section, status, text) VALUES ("' + author + '", "' + date + '", "' + title + '", "' + section + '", "' + status + '", "' + text + '");');
        })
        .then((response) => {
          conn.end();
          res.redirect('/');
        })
        .catch(err => {
          //handle error
          console.log(err);
          conn.end();
        })

    }).catch(err => {
      //not connected
    });
});

module.exports = router;
