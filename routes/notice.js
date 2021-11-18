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

//공지사항 화면
router.get('/', function(req, res, next) {
    let posts = models.post.findAll();
    res.render('notice/notice', { posts: posts });
});
//게시글 화면
router.get('/notice/:noticeId', function (req, res, next) {
    let noticeId = req.params.noticeId;

    models.notice.findOne({
        where: { id: noticeId },
        include: {
            model: [reply],

        }
    }).then(posts => {
        res.render('notice/notice', { posts: posts })
    });
});
router.get('/writeNotice', function(req, res, next) {
    res.render('notice/writeNotice');
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
        res.redirect("/notice");
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
        res.redirect("/notice/post/:postId");
    }).catch(err => {
        console.log("댓글 추가 실패");
    });
});

module.exports = router;