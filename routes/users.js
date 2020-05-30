const users = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const { getProfile } = require('../controllers/users');

users.get(
  '/me',
  getProfile,
);

module.exports = users;
