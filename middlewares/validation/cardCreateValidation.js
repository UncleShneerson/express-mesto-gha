const ValidationError = require('../../Errors/ValidationError');

const cardCreateValidation = async (req, res, next) => {
  const { name, link } = req.body;

  if (!name || !link) {
    const err = new ValidationError('Значения не переданы или переданы не полностью');
    return res.status(err.statusCode).send({ message: err.message });
  }

  if ((typeof name !== 'string') || (typeof link !== 'string')) {
    const err = new ValidationError('Не верный формат данных');
    return res.status(err.statusCode).send({ message: err.message });
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
