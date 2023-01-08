import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errors } from 'celebrate';
import { router } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { limiter } from './utils/rateLimiter.js';
import { config } from './utils/constants.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.set('config', config);

app.use(cors({
  origin: '*',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
}));

app.use(bodyParser.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter);
// Подключаем все роутинги
app.use(router);
// Логирование ошибок
app.use(errorLogger);
// Централизованный обработчик ошибок
app.use(errors());
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});
