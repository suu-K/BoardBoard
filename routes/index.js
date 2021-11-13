var express = require('express');
var router = express.Router();
const mysql = require('mysql');

let client = mysql.createConnection({
  user : 'root',
  password : 1234,
  database : 'boardboard'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//페이지 전환
router.get('/games', function(req, res, next) {
  res.render('games');
});

router.get('/party', function(req, res, next) {
  res.render('party');
});

router.get('/notice', function(req, res, next) {
  res.render('notice');
});


module.exports = router;
