const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const { KEY } = require('../config');


module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  if (!token) throw new Unauthorized('Нужно войти в систему');

  try {
    payload = jwt.verify(token, KEY);
  } catch (err) {
    next(new Unauthorized('Нужно войти в систему'));
  }


  req.user = payload;
  next();
};