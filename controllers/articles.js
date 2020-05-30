const Article = require('../models/articles');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden')

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
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const owner = req.user._id

  Article.findById({ _id: articleId })
    .then((article) => {
      if (!article) throw new NotFoundError('Не удалось найти карточку с таким id');
      if (article.owner !== owner) throw new Forbidden('Вы не можете удалить чужую карточку');
      Article.findByIdAndDelete({ _id: articleId })
        .then(articleToDelete => {
          res.status(200).send(articleToDelete);
        })
    })
    .catch(next);
};