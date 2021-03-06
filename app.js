require('dotenv').config();

// Подключенные бибилиотеки
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

// Подключенные модули
const { mongooseConfig, PORT, DATABASE_URL } = require('./config');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const rateLimiter = require('./middlewares/rateLimiter');

// Запуск приложения
const app = express();
mongoose.connect(DATABASE_URL, mongooseConfig);

// Миддлверы для обработки входящих запросов
app.use(helmet());
app.use(rateLimiter);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'mesto4.fun');
  next();
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// Руты
app.use('/', router);

// Обработчики ошибок
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT);
