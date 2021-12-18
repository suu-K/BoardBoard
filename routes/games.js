var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const models = require('../models');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { verifyAdmin } = require('../middleware/admin');
const { Sequelize } = require('../models');
const { type } = require('jquery');
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
      console.log("imageTest");
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
  },
});

var upload = multer({ storage: storage });
//게임 목록 화면

router.get('/', function(req, res, next) {
    res.render('games/games', { session: req.session });
});
 
router.get('/readGame', function(req, res, next) {
    res.render('games/readGames', { session: req.session });
});

router.get('/writeGame', function(req, res, next) {
    res.render('games/writeGames', { session: req.session });
});

router.post('/writeGame', upload.single('fileName'), function(req, res, next){
    let body = req.body;
    console.log("test");
    models.game.create({
        name:body.name,
        member:body.member,
        time:body.time,
        level:body.level,
        method:body.method,
        content:body.content,
        image:`/images/${req.file.filename}`
    }).then(result =>{
        console.log("test2");
        res.redirect('/games');
    }).catch(err =>{
        console.log("test3");
        console.log(err);
    })
})

module.exports = router;