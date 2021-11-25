const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyAdmin = (req, res, next) => {
	try
	{
		req.decoded = jwt.verify(req.cookies.boardAdmin, "" +process.env.JWT_ADMIN_KEY);        
		return next();
	}
	catch (error) {
		if(req.session){
			req.session.destroy();
		}
		if (error.name === 'TokenExpiredError') {
			res.send("<script>alert('다시 로그인해주세요.');location.href='/users/login';</script>");
		}

		res.send("<script>alert('관리자만 접근 가능합니다.');location.href='/users/login';</script>");
	}
};