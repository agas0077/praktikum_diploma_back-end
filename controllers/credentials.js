const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { KEY, COOKIE_DOMAIN } = require('../config');
const Forbidden = require('../errors/Forbidden');

module.exports.signup = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user === null) {
        return bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              email,
              password: hash,
              name,
            })
              .then(() => {
                res.status(200).end();
              })
              .catch(next);
          })
          .catch(next);
      }
      throw new Forbidden('Пользователь с таким адресом уже существует');
    })
    .catch(next);
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  console.log(COOKIE_DOMAIN);

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
            domain: COOKIE_DOMAIN,
          },
        )
        .cookie(
          'isLogged',
          1,
          {
            domain: COOKIE_DOMAIN,
            maxAge: 1000 * 60 * 60 * 24 * 7,
          },
        )
        .cookie(
          'name',
          user.name,
          {
            domain: COOKIE_DOMAIN,
            maxAge: 1000 * 60 * 60 * 24 * 7,
          },
        )
        .end();
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  res
    .clearCookie('jwt', { domain: COOKIE_DOMAIN })
    .clearCookie('name', { domain: COOKIE_DOMAIN })
    .clearCookie('isLogged', { domain: COOKIE_DOMAIN })
    .end();
};
