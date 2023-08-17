const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ValidationError = require('../Errors/ValidationError');
const NotFoundError = require('../Errors/NotFoundError');
const RegError = require('../Errors/RegError');

const { CREATED } = require('../utils/errorCodes');
const User = require('../models/user');

// Создать юзера
module.exports.createUser = (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      password: hash,
      email,
    }))
    .then((userData) => {
      const { _id, email, name, about, avatar } = userData;
      res
        .status(CREATED).send({
          _id,
          name,
          email,
          about,
          avatar,
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new RegError());
      }
      if (err.name === 'ValidationError') {
        return next(new ValidationError());
      }
      return next(err);
    });
};

// Вход
module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-phrase', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
          maxAge: (60 * 60 * 24 * 7),
        })
        .send({ message: 'Успешная авторизация' })
        .end();
    })
    .catch((err) => next(err));
};

// Выход
module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt')
    .send({ message: 'Выход осуществлен' });
};

// Получить информацию о себе
module.exports.showUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((userData) => {
      res.send(userData);
    })
    .catch((err) => next(err));
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
