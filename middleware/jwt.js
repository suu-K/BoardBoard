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
	  		return res.status(419).json({
	    		code: 419,
	    		message: '토큰만료'
	  		});
		}

		return res.status(401).json({
			code: 401,
	  		message: '유효하지 않은 토큰'
		});
	}
};