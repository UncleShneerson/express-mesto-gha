/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
const ValidationError = require('../Errors/ValidationError');
const PropertyRequiredError = require('../Errors/PropertyRequiredError');
const SameDataError = require('../Errors/SameDataError');

const User = require('../models/user');

// Начал делать разбор ошибок, и какую-то валидацию но прям не понимаю зачем,
// если валидация на следующем спринте?S

// Получить всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Получить юзера по ID
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((userData) => {
      res.status(200).send(userData);
    })
    .catch(() => {
      res.status(404).send({ message: 'Пальзователь не существует' });
    });
};

// Создать юзера
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  // Валидация
  let nameIsValid = false;
  let aboutIsValid = false;
  let avatarIsValid = false;

  if (name && (name.length > 2) && (name.length < 30) && (typeof name === 'string')) {
    nameIsValid = true;
  }

  if (about && (about.length > 2) && (about.length < 30) && (typeof about === 'string')) {
    aboutIsValid = true;
  }

  if (avatar && (avatar.length > 5) && (typeof avatar === 'string')) {
    avatarIsValid = true;
  }

  if (!nameIsValid || !aboutIsValid || !avatarIsValid) {
    return res.status(400).send({ message: 'Данные не валидны. Проверьте еще раз' });
  }

  User.create({ name, about, avatar })
    .then((userData) => res.send(userData))
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};

// Обновить аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (avatar) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
      .then((userData) => {
        if (avatar !== userData.avatar) {
          userData.avatar = avatar;
          res.send(userData);
        }
        return Promise.reject(new SameDataError());
      })
      .catch((err) => res.status(err.statusCode).send({ message: err.message }));
  } else {
    const err = new PropertyRequiredError('Аватара');
    res.status(err.statusCode).send({ message: err.message });
  }
};

// Обновить профиль
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((userData) => {
      let newData = false;
      try {
        // Валидация
        if (!name && !about) {
          return Promise.reject(new ValidationError('Значения не переданы'));
        }

        let nameIsValid = false;
        let aboutIsValid = false;

        if (name && (name.length > 2) && (name.length < 30) && (typeof name === 'string')) {
          nameIsValid = true;
        }

        if (about && (about.length > 2) && (about.length < 30) && (typeof about === 'string')) {
          aboutIsValid = true;
        }

        if (!nameIsValid || !aboutIsValid) {
          return res.status(400).send({ message: 'Данные не валидны. Проверьте еще раз' });
        }

        // Проверка на отличия
        if (name && (name !== userData.name)) {
          userData.name = name;
          newData = true;
        }

        if (about && (about !== userData.about)) {
          userData.about = about;
          newData = true;
        }

        if (newData) {
          res.send(userData);
          return;
        }
        return Promise.reject(new SameDataError());
      } catch (err) {
        return Promise.reject(new Error(err.message));
      }
    })
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};
