require('dotenv').config();

// Подключенные бибилиотеки
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { Joi, celebrate, errors } = require('celebrate');
const cookieParser = require('cookie-parser');

// Подключенные модули
const { mongooseConfig, PORT, DATABASE_URL } = require('./config');
const router = require('./routes/index');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/credentials');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const rateLimiter = require('./middlewares/rateLimiter');

// Запуск приложения
const app = express();
mongoose.connect(DATABASE_URL, mongooseConfig);

// Миддлверы для обработки входящих запросов
app.use(helmet());
app.use(rateLimiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// Все, что связано с уставновлением личность пользователя =)
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

// Руты
app.use('/', router);

// Обработчики ошибок
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT);
