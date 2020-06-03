const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getProfile = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};
