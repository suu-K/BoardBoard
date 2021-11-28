const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
	try
	{
		req.decoded = jwt.verify(req.cookies.board, "" +process.env.JWT_KEY);
		return next();
	}
	catch (error) {
		if(req.session){
			req.session.destroy();
		}

		if (error.name === 'TokenExpiredError') {
			res.send("<script>alert('다시 로그인해주세요.');location.href='/users/login';</script>");
		}

		res.send("<script>alert('로그인이 필요합니다.');location.href='/users/login';</script>");
	}
};