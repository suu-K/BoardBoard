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
    let pageNum = 1; // 요청 페이지 넘버
    let offset = 0;
    let count = models.post.count({});
    const getData = () => {
        count.then((appData) => {
          count = appData;
        });
    };
    getData();
    let limit = 5;
    if (pageNum > 1) {
        offset = limit * (pageNum - 1);
    }

    models.game.findAll({
        offset: offset,
        limit: limit,
        attributes:[
            'id', 'name', 'image'
        ],
        order: [["id", "desc"]]
    })
    .then(result => {
        res.render('games/games', {
            games: result,
            session: req.session,
            pageNum: pageNum,
            count: Math.ceil(count/limit)
        });
    })
    .catch(function (err) {
        console.log(err);
    });
});

router.get('/:page', function(req, res, next) {
    let pageNum = page; // 요청 페이지 넘버
    let offset = 0;
    let count = models.post.count({});
    const getData = () => {
        count.then((appData) => {
          count = appData;
        });
    };
    getData();
    let limit = 5;
    if (pageNum > 1) {
        offset = limit * (pageNum - 1);
    }

    models.game.findAll({
        offset: offset,
        limit: limit,
        attributes:[
            'id', 'name', 'image'
        ],
        order: [["id", "desc"]]
    })
    .then(result => {
        res.render('games/games', {
            games: result,
            session: req.session,
            pageNum: pageNum,
            count: Math.ceil(count/limit)
        });
    })
    .catch(function (err) {
        console.log(err);
    });
});
 
router.get('/readGame/:id', function(req, res, next) {
    let gameId = req.params.id;

    models.game.findOne({ where: { id: gameId }}
    ).then(game => {
        res.render('games/readGame', { game:game, session: req.session })
    });
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
});

router.post('/writeGame/delete/:gameId', verifyAdmin, function(req, res, next){
    models.game.destroy({ 
        where: { id: req.params.gameId} 
    }).then(function(result){
        res.redirect("/games");
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;