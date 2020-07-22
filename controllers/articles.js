const Article = require('../models/articles');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

module.exports.getArticles = (req, res, next) => {
  const owner = req.user._id;

  Article.find({ owner })
    .orFail(() => new NotFoundError('Сохраненные статьи найдены не были'))
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((result) => {
      console.log(result);
      res.status(200).send({ id: result._id });
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const owner = req.user._id;

  Article.findById({ _id: articleId }).select('+owner')
    .orFail(() => new NotFoundError('Не удалось найти карточку с таким id'))
    .then((article) => {
      if (String(article.owner) !== owner) throw new Forbidden('Вы не можете удалить чужую карточку');
      Article.findByIdAndDelete({ _id: articleId })
        .then(() => {
          res.status(200).send();
        });
    })
    .catch(next);
};
