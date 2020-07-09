const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { KEY } = require('../config');
const Forbidden = require('../errors/Forbidden');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  const userExists = User.findOne({ email }).then(() => true).catch(() => false);

  if (userExists) {
    throw new Forbidden('Пользователь с таким адресом уже существует');
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          email,
          password: hash,
          name,
        })
          .then((user) => {
            User.findOne({ _id: user._id });
          })
          .then((user) => {
            res.status(200).send(user);
          })
          .catch(next);
      });
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) throw new Error();


      const token = jwt.sign(
        { _id: user._id },
        KEY,
        { expiresIn: '7d' },
      );

      res
        .cookie(
          'jwt',
          token,
          {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          },
        )
        .end();
    })
    .catch(next);
};
