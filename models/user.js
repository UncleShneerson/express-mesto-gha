const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthError = require('../Errors/AuthError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function innerFunction(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неверные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) {
            return Promise.reject(new AuthError('Неверные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
