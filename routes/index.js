const routes = require('express').Router();
const cards = require('./articles.js');
const users = require('./users.js');

routes.use('/articles', cards);
routes.use('/users', users);

module.exports = routes;
