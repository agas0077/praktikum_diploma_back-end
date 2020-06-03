const users = require('express').Router();

const { getProfile } = require('../controllers/users');

users.get(
  '/me',
  getProfile,
);

module.exports = users;
