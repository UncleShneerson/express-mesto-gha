const ValidationError = require('../Errors/ValidationError');
const NotFoundError = require('../Errors/NotFoundError');

const { CREATED } = require('../utils/errorCodes');

const User = require('../models/user');

// Получить всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

// Получить юзера по ID
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((userData) => {
      res.send(userData);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Несуществующий ID'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Некоректный ID'));
      } else {
        next(err);
      }
    });
};

// Создать юзера
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((userData) => res.status(CREATED).send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

// Обновить аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((userData) => {
      res.send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError());
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError());
      } else {
        next(err);
      }
    });
};

// Обновить профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((userData) => {
      res.send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError());
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError());
      } else {
        next(err);
      }
    });
};
