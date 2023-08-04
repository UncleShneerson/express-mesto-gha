const ValidationError = require('../../Errors/ValidationError');

const userUpdateValidation = (req, res, next) => {
  const { name, about } = req.body;

  if (!name && !about) {
    return Promise.reject(new ValidationError('Значения не переданы'));
  }

  let nameIsValid = true;
  let aboutIsValid = true;

  if (name && ((name.length < 2) || (name.length > 30) || (typeof name !== 'string'))) {
    nameIsValid = false;
  }

  if (about && ((about.length < 2) || (about.length > 30) || (typeof about !== 'string'))) {
    aboutIsValid = false;
  }

  if (!nameIsValid || !aboutIsValid) {
    const err = new ValidationError('Данные не валидны. Проверьте еще раз');
    return res.status(err.statusCode).send({ message: err.message });
  }

  return next();
};

module.exports = userUpdateValidation;
