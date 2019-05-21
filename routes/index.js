var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.MariaHost,
  user: process.env.MariaUser,
  password: process.env.MariaPassword,
  connectionLimit: 5
});

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.getConnection()
    .then(conn => {
      conn.query("USE TP3")
        .then((rows) => {
          return conn.query("SELECT * FROM articles");
        })
        .then((response) => {
          conn.end();
          res.render('index', { title: 'The World News::' , data: response});
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
