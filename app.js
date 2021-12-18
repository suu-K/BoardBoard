var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var logger = require('morgan');
const expressLayouts=require('express-ejs-layouts');

require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var partyRouter = require('./routes/party');
var noticeRouter = require('./routes/notice');
var gameRouter = require('./routes/games');

var app = express();
app.use(expressLayouts);

const models = require("./models/index.js");
const { application } = require('express');

models.sequelize.sync().then( () => {
    console.log(" DB connect success");
}).catch(err => {
    console.log("연결 실패");
    console.log(err);
})

app.use(session({
  key: 'user',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 5 // 쿠키 5분
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('layout','./layouts/layout');
app.set("layout extractScripts",true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/party', partyRouter);
app.use('/notice', noticeRouter);
app.use('/games', gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;