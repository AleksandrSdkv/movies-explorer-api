import { Router } from 'express';
import {
  updateUser,
  findCurrentUser,
} from '../controllers/users.js';
import { profileValid } from '../validators/usersValidators.js';

export const userRouter = Router();

userRouter.get('/users/me', findCurrentUser);
userRouter.patch('/users/me', profileValid, updateUser);
