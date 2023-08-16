const { Joi, celebrate } = require('celebrate');

const regexURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const regexEmail = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
const regexPass = /\w-{6,30}/;

// Валидация авторизации
const signUpValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(regexEmail).required(),
    password: Joi.string().min(6).max(30).pattern(regexPass).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexURL),
  }),
});

const logInValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(regexEmail).required(),
    password: Joi.string().min(6).pattern(regexEmail).required(),
  }),
});

// Валидация пользователей
const userUpdateValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const avatarUpdateValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexURL).required(),
  }),
});

// Валидация карточек
const cardCreateValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regexURL).required(),
  }),
});

// Валидация ID
const IdValidate = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  signUpValidate,
  logInValidate,
  userUpdateValidate,
  avatarUpdateValidate,
  cardCreateValidate,
  IdValidate,
};
