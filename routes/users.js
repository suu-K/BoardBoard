var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require('crypto');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render("user/signup");
});


router.post("/sign_up", async function(req,res,next){
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

  res.redirect("/user/sign_up");
});

// 메인 페이지
router.get('/', function(req, res, next) {
  if(req.cookies){
      console.log(req.cookies);
  }

  res.send("환영합니다 ~");
});

router.get('/login', function(req, res, next) {
  let session = req.session;

  res.render("user/login", {
      session : session
  });
});

// 로그인 POST
router.post("/login", async function(req,res,next){
  let body = req.body;

  let result = await models.user.findOne({
      where: {
          email : body.userEmail
      }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if(dbPassword === hashPassword){
      console.log("비밀번호 일치");
      // 세션 설정
      req.session.email = body.userEmail;
  }
  else{
      console.log("비밀번호 불일치");
  }
  res.redirect("/user/login");
});

router.get("/logout", function(req,res,next){
  req.session.destroy();
  res.clearCookie('sid');

  res.redirect("/user/login")
});

module.exports = router;
