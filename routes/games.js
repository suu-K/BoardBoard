var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const models = require('../models');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { verifyAdmin } = require('../middleware/admin');
const { Sequelize } = require('../models');

//게임 목록 화면

router.get('/', function(req, res, next) {
    res.render('games/games', { session: req.session });
});
 
router.get('/readGames', function(req, res, next) {
    res.render('games/readGames', { session: req.session });
});

module.exports = router;