var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { verifyToken } = require('../middleware/jwt');



/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.cookies){
    console.log(req.cookies);
}

res.send("환영합니다 ~");
});
//회원가입 화면
router.get('/join', function(req, res, next) {
  res.render("user/join", { session: req.session });
});
//회원가입 요청
router.post("/join", async function(req,res,next){
  let body = req.body;

  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  let result = models.user.create({
      name: body.userName,
      email: body.userEmail,
      password: hashPassword,
      salt: salt
  })

  res.redirect("/users/login");
});

//로그인 화면
router.get('/login', function(req, res, next) {
  res.render("user/login", { session : req.session });
});

// 로그인 요청
router.post("/login", async function (req, res, next) {
  let body = req.body;

  let result = await models.user.findOne({
    where: {
      email: body.userEmail
    }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if (dbPassword === hashPassword) {
    req.session.name = result.dataValues.name;
    req.session.id = result.dataValues.id;
    req.session.admin = false;
    console.log("correct password " + req.session.name);

    //관리자
    if (result.dataValues.id <= 1) {
      const adminToken = jwt.sign({
        id: result.dataValues.id,
        name: result.dataValues.userName,
        admin: true
      }, process.env.JWT_ADMIN_KEY, {
        expiresIn: '5m'
      });
      res.cookie('boardAdmin', adminToken, {
        httpOnly: true
      });
      req.session.admin = true;
    }
    //유저
    const token = jwt.sign({
      id: result.dataValues.id,
      name: result.dataValues.userName,
      admin: false
    }, process.env.JWT_KEY, {
      expiresIn: '5m'
    });
    // jwt 토큰 설정
    res.cookie('board', token, {
      httpOnly: true
    });
  }
  else {
    console.log("incoreect password");
  }
  res.redirect("/");
});
//로그아웃 요청
router.get("/logout", function(req,res,next){
  res.clearCookie("board");
  res.clearCookie("boardAdmin");
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
