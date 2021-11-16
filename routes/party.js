var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const models = require('../models');
const reply = require('../models/reply');

let client = mysql.createConnection({
  user : 'root',
  password : 1234,
  database : 'boardboard'
})

//게시판 화면
router.get('/', function(req, res, next) {
    let posts = models.post.findAll();
    res.render('party/party', { posts: posts });
});
//게시글 화면
router.get('/post/:postId', function (req, res, next) {
    let postId = req.params.postId;

    models.post.findOne({
        where: { id: postId },
        include: {
            model: [reply],

        }
    }).then(posts => {
        res.render('party/party', { posts: posts })
    });
});
router.get('/writePost', function(req, res, next) {
    res.render('party/writePost');
});
//게시글 작성 요청
router.post('/post', function (req, res, next) {
    let body = req.body;

    let result = models.post.create({
        writerId: body.id,
        title: body.title,
        content: body.content,
        date: body.date
    }).then(result => {
        res.redirect("/party");
    }).catch(err => {
        console("게시글 추가 실패");
    });
});
//댓글 작성 요청
router.post('/reply/:postId', function (req, res, next) {
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