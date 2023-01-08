import { Router } from 'express';
import helmet from 'helmet';
import { userRouter } from './users.js';
import { movieRouter } from './movies.js';
import { createUser, login } from '../controllers/users.js';
import { auth } from '../middlewares/auth.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { userBodyValid, loginValid } from '../validators/authValidators.js';

export const router = Router();

router.post('/signup', userBodyValid, createUser);
router.post('/signin', loginValid, login);

router.use(auth);
router.use(helmet());
router.use('/', userRouter);
router.use('/', movieRouter);

router.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});
