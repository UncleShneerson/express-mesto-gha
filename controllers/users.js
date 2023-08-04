const SameDataError = require('../Errors/SameDataError');

const User = require('../models/user');

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
      if (userData) {
        res.status(200).send(userData);
        return;
      }
      res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch(() => {
      res.status(400).send({ message: 'Неверный идентификатор' });
    });
};

// Создать юзера
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((userData) => res.send(userData))
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};

// Обновить аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((userData) => {
      if (avatar !== userData.avatar) {
        userData.avatar = avatar;
        res.send(userData);
      }
      const err = Promise.reject(new SameDataError());
      return res.status(err.statusCode).send({ message: err.message });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Обновить профиль
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((userData) => {
      let newData = false;
      try {
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
