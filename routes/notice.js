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
    let pageNum = 1; // 요청 페이지 넘버
    let offset = 0;
    let count = models.notice.count({});
    const getData = () => {
        count.then((appData) => {
          count = appData;
        });
    };
    getData();
    let limit = 7;
    if (pageNum > 1) {
        offset = limit * (pageNum - 1);
    }

    models.notice.findAll({
        offset: offset,
        limit: limit,
        attributes:[
            'id', 'title',
            [Sequelize.fn('date_format', Sequelize.col('createdAt'), '%Y-%m-%d'), 'createdAt']
        ],
        order: [["id", "desc"]]
    })
    .then(result => {
        res.render('notice/notice', {
            notices: result,
            session: req.session,
            pageNum: pageNum,
            count: Math.ceil(count/limit),
        });
    })
    .catch(function (err) {
        console.log(err);
    });
});

router.get('/:page', function(req, res, next) {
    let pageNum = req.query.page; // 요청 페이지 넘버
    let offset = 0;
    let count = models.notice.count({});
    const getData = () => {
        count.then((appData) => {
          count = appData;
        });
    };
    getData();
    let limit = 7;
    if (pageNum > 1) {
        offset = limit * (pageNum - 1);
    }

    models.notice.findAll({
        offset: offset,
        limit: limit,
        attributes:[
            'id', 'title',
            [Sequelize.fn('date_format', Sequelize.col('createdAt'), '%Y-%m-%d'), 'createdAt']
        ],
        order: [["id", "desc"]]
    })
    .then(result => {
        res.render('notice/notice', {
            notices: result,
            session: req.session,
            pageNum: pageNum,
            count: Math.ceil(count/limit),
        });
    })
    .catch(function (err) {
        console.log(err);
    });
});
//공지사항 화면
router.get('/post/:noticeId', function (req, res, next) {
    let noticeId = req.params.noticeId;

    models.notice.findOne({ where: { id: noticeId }}
    ).then(notice => {
        res.render('notice/readNotice', { notice: notice, session: req.session })
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
//공지 수정 요청
router.post('/writeNotice/update/:noticeId', verifyAdmin, function (req, res, next) {
    let body = req.body;

    models.notice.update({
        title: body.title,
        content: body.content
    }, { where: { id:req.params.noticeId } }
    ).then(result => {
        res.redirect("/notice/:noticeId");
    }).catch(err => {
        console.log(err);
    });
});
//공지 삭제 요청
router.post('/writeNotice/delete/:noticeId', verifyAdmin, function(req, res, next){
    models.notice.destroy({ 
        where: { id: req.params.noticeId} 
    }).then(function(result){
        res.redirect("/notice");
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;