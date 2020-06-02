const routes = require('express').Router();
const cards = require('./articles.js');
const users = require('./users.js');
const credentials = require('./credentials');
const { auth } = require('../middlewares/auth');

routes.use('/', credentials);

routes.use(auth);

routes.use('/articles', cards);
routes.use('/users', users);

module.exports = routes;
