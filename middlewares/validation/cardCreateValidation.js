const ValidationError = require('../../Errors/ValidationError');

const cardCreateValidation = async (req, res, next) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return Promise.reject(new ValidationError('Значения не переданы или переданы не полностью'));
  }

  let nameIsValid = false;
  let linkIsValid = false;

  if (name && (name.length >= 2) && (name.length <= 30) && (typeof name === 'string')) {
    nameIsValid = true;
  }

  if (link && (link.length > 5) && (typeof link === 'string')) {
    linkIsValid = true;
  }

  if (!nameIsValid || !linkIsValid) {
    const err = new ValidationError('Данные не валидны. Проверьте еще раз');
    return res.status(err.statusCode).send({ message: err.message });
  }

  return next();
};

module.exports = cardCreateValidation;
