const credentials = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const { signup, signin, signout } = require('../controllers/credentials');

credentials.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  signup,
);

credentials.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  signin,
);

credentials.get('/signout', signout);

module.exports = credentials;
