import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.js';
import { ConflictError } from '../errors/ConflictError.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name,
      email,
      password: hash,
    }))
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(new InternalServerError('Произошла ошибка сервера'));
      }
    });
};

export const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  userModel.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        console.log(user);
        next(new NotFoundError('Пользователь не найден'));
      } else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка сервера'));
      }
    });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = req.app.get('config');
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );
      // вернём токен
      res
        .cookie('jwt', token, {

          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).send({ token });
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        next(new UnauthorizedError('Неправильные почта или пароль'));
      } else {
        next(err);
      }
    });
};

export const findCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные поиска'));
      } else {
        next(new InternalServerError('Произошла ошибка сервера'));
      }
    });
};
