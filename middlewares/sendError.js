const { SERVER_ERROR } = require('../utils/errorCodes');

const sendError = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  }).end();
  next();
};

module.exports = sendError;
