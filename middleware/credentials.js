const allowedOrigins = require('../config/allowedOrigins');

const credential = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.headers('Access-Control-Allow-Credentials', true);
  }

  next();
};

module.exports = credential;
