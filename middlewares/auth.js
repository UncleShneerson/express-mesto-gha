const jwt = require('jsonwebtoken');
const AuthError = require('../Errors/NotFoundError');

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-phrase');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }
  req.user = payload;
  next();
}

module.exports = auth;
