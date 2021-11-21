var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const models = require('../models');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { verifyAdmin } = require('../middleware/admin');
const { Sequelize } = require('../models');

//공지사항 목록 화면
router.get('/', function (req, res, next) {
    models.notice.findAll({
        attributes:[
            'id', 'title',
            [Sequelize.fn('date_format', Sequelize.col('createdAt'), '%Y-%m-%d'), 'createdAt']
        ]
    })
        .then(result => {
            res.render('notice/notice', {
                notices: result,
                session: req.session
            });
        })
        .catch(function (err) {
            console.log(err);
        });
});
//공지사항 화면
router.get('/notice/:noticeId', function (req, res, next) {
    let noticeId = req.params.noticeId;

    models.notice.findOne({ where: { id: noticeId }}
    ).then(notice => {
        res.render('notice/notice', { notice: notice, session: req.session })
    });
});

//공지 작성 화면
router.get('/writeNotice', verifyAdmin, function(req, res, next) {
    res.render('notice/writeNotice', { session: req.session });
});
//공지 작성 요청
router.post('/writeNotice', verifyAdmin, function (req, res, next) {
    let body = req.body;

    let result = models.notice.create({
        title: body.title,
        content: body.content
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