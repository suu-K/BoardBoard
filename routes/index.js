var express = require('express');
const session = require('express-session');
var router = express.Router();
const mysql = require('mysql');

let client = mysql.createConnection({
  user : 'root',
  password : 1234,
  database : 'boardboard'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { session: req.session });
});

//페이지 전환
router.get('/games', function(req, res, next) {
  res.render('games', { session: req.session });
});





module.exports = router;
