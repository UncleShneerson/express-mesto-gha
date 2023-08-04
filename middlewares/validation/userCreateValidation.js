const ValidationError = require('../../Errors/ValidationError');

const userCreateValidation = async (req, res, next) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    const err = new ValidationError('Значения не переданы или переданы не полностью');
    return res.status(err.statusCode).send({ message: err.message });
  }

  if ((typeof name !== 'string') || (typeof about !== 'string') || (typeof avatar !== 'string')) {
    const err = new ValidationError('Не верный формат данных');
    return res.status(err.statusCode).send({ message: err.message });
  }

  let nameIsValid = false;
  let aboutIsValid = false;
  let avatarIsValid = false;

  if (name && (name.length >= 2) && (name.length <= 30) && (typeof name === 'string')) {
    nameIsValid = true;
  }

  if (about && (about.length >= 2) && (about.length <= 30) && (typeof about === 'string')) {
    aboutIsValid = true;
  }

  if (avatar && (avatar.length > 5) && (typeof avatar === 'string')) {
    avatarIsValid = true;
  }

  if (!nameIsValid || !aboutIsValid || !avatarIsValid) {
    const err = new ValidationError('Данные не валидны. Проверьте еще раз');
    return res.status(err.statusCode).send({ message: err.message });
  }

  return next();
};

module.exports = userCreateValidation;
