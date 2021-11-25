var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const models = require('../models');
const reply = require('../models/reply');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { verifyToken } = require('../middleware/jwt');
const { Sequelize } = require('../models');
const { application } = require('express');

//게시판 화면
router.get('/', function(req, res, next) {
    models.post.findAll({
        attributes:[
            'id', 'title', 'place', 'date',
            [Sequelize.fn('date_format', Sequelize.col('post.createdAt'), '%Y-%m-%d'), 'createdAt']
        ],
        include:{model: models.user}
    })
        .then(result => {
            res.render('party/party', {
                posts: result,
                session: req.session
            });
        })
        .catch(function (err) {
            console.log(err);
        });
});
//게시글 화면
router.get('/post/:postId', function (req, res, next) {
    let postId = req.params.postId;

    models.post.findOne({
        where: { id: postId },
        include:{model: models.user}
        /* 댓글 기능
        ,include: {
            model: [reply],
        */
        }
    ).then(post => {
        res.render('party/readPost', { post: post, session: req.session })
    });
});
router.get('/writePost', verifyToken, function(req, res, next) {
    res.render('party/writePost', {session: req.session});
});
//게시글 작성 요청
router.post('/writePost', verifyToken, function (req, res, next) {
    let body = req.body;

    let result = models.post.create({
        writerId: 1,
        title: body.title,
        place: body.place,
        content: body.content,
        date: body.date
    }).then(result => {
        res.redirect("/party");
    }).catch(err => {
        console.log(err);
    });
});
//댓글 작성 요청
router.post('/reply/:postId', verifyToken, function (req, res, next) {
    let body = req.body;

    let result = models.reply.create({
        postId: req.params.postId,
        writerId: body.writerId,
        content: body.content,
        accept: null
    }).then(result => {
        res.redirect("/party/post/:postId");
    }).catch(err => {
        console.log("댓글 추가 실패");
    });
});

module.exports = router;

