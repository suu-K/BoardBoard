var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const models = require('../models');
const reply = require('../models/reply');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { verifyToken } = require('../middleware/jwt');
const { Sequelize } = require('../models');
const { route } = require('.');

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
        include: [
            { model: models.user },
            { 
                model: models.reply,
                include: { model: models.user },
                order: 'createdAt DESC',
                required: false
            }
        ]
    }).then(post => {
        try{
            console.log("success");
        res.render('party/readPost', { post: post, session: req.session })
        }
        catch(err){
            console.log("err");
            console.log(err);
        }
    }).catch(err =>{
        console.log(err);
    });
    
});
router.get('/writePost', verifyToken, function(req, res, next) {
    res.render('party/writePost', {session: req.session});
});
//게시글 작성 요청
router.post('/writePost', verifyToken, function (req, res, next) {
    let body = req.body;

    models.post.create({
        writerId: req.session.id,
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
//게시글 수정 요청
router.post('/writePost/update/:postId', verifyToken, function (req, res, next) {
    let body = req.body;

    models.post.update({
        title: body.title,
        place: body.place,
        content: body.content,
        date: body.date
    }, { where: { id: req.params.postId } }
    ).then(result => {
        res.redirect("/party/post/:postId");
    }).catch(err => {
        console.log(err);
    });
});
//게시글 삭제 요청
router.post('/writePost/delete/:postId', verifyToken, function(req, res, next){
    models.post.destroy({ 
        where: { id: req.params.postId} 
    }).then(function(result){
        res.redirect("/party");
    }).catch(err => {
        console.log(err);
    });
});
//댓글 작성 요청
router.post('/reply/:postId', verifyToken, function (req, res, next) {
    let body = req.body;
    req.decoded = jwt.verify(req.cookies.board, "" +process.env.JWT_KEY);

    models.reply.create({
        postId: req.params.postId,
        writerId: req.session.id,
        content: body.content,
        accept: null
    }).then(result => {
        res.redirect("/party/post/"+req.params.postId);
    }).catch(err => {
        console.log(err);
    });
});
//댓글 수정 요청
router.post('/reply/update/:replyId', verifyToken, function (req, res, next) {
    let body = req.body;

    models.post.update(
        { content: body.content },
        { where: { id: req.params.replyId } }
    ).then(result => {
        res.redirect("/party/post/:postId");
    }).catch(err => {
        console.log(err);
    });
});
//댓글 삭제 요청
router.post('/replyPost/delete/:replyId', verifyToken, function(req, res, next){
    models.post.destroy({ 
        where: { id: req.params.replyId} 
    }).then(function(result){
        history.back();
    }).catch(err => {
        console.log(err);
    });
});

//참가 신청
router.post('/apply/:postId', verifyToken, function(req, res, next){
    models.participant.create({
        postId: req.params.postId,
        userId: req.session.id,
        accept: false
    }).then(result => {
        res.redirect("/party/post/"+req.params.postId);
    }).catch(err => {
        console.log(err);
    });
});
//참가 수락
router.post('/accept/:postId/:userId', verifyToken, function(req, res, next){
    models.participant.update(
        { accept: true },
        { where: { postId: req.params.postId, userId: req.params.userId }}
    ).then(result =>{
        res.redirect("/party/post"+req.params.postId);
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;