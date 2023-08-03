/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
const ValidationError = require('../Errors/ValidationError');
const PropertyRequiredError = require('../Errors/PropertyRequiredError');
const SameDataError = require('../Errors/SameDataError');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((userData) => {
      res.send(userData);
    })
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

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

// Начал делать разбор всех ошибок, но не очень понял надо ли это делать,
// т.к. следующий спринт - валидация?
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((userData) => {
      let newData = false;
      try {
        if (!name && !about) {
          return Promise.reject(new ValidationError('Значения не переданы'));
        }

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
