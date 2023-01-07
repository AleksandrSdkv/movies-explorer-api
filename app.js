import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler.js';
import { userRouter } from './routes/users.js';
import { movieRouter } from './routes/movies.js';
import { createUser, login } from './controllers/users.js';
import { auth } from './middlewares/auth.js';
import { NotFoundError } from './errors/NotFoundError.js';
import { userBodyValid, loginValid } from './validators/authValidators.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

dotenv.config();
const config = dotenv.config({ path: path.resolve(process.env.NODE_ENV === 'production' ? '.env' : '.env.common') }).parsed;

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
const limiter = rateLimit({
  max: 100,
});
app.use(limiter);

app.post('/signup', userBodyValid, createUser);
app.post('/signin', loginValid, login);

app.use(auth);
app.use(helmet());
app.use('/', userRouter);
app.use('/', movieRouter);

app.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});
