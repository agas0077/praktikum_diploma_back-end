require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { Joi, celebrate, errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { mongooseConfig, PORT, DATABASE_URL } = require('./config');
const router = require('./routes/index');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/credentials');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());

mongoose.connect(DATABASE_URL, mongooseConfig);
mongoose.connection.on('connected', () => {
  console.log('Connected');
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger)

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(auth);

app.use('/', router);

app.use(errors());
app.use(errorLogger);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
});

app.listen(PORT);
