const PropertyRequiredError = require('../../Errors/PropertyRequiredError');
const ValidationError = require('../../Errors/ValidationError');

const avatarUpdateValidation = (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) {
    const err = new PropertyRequiredError('Аватара');
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  if (avatar && (typeof avatar !== 'string')) {
    const err = new ValidationError('Данные не валидны. Проверьте еще раз');
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  next();
};

module.exports = avatarUpdateValidation;
