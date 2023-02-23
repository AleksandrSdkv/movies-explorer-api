import { movieModel } from '../models/movie.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const getMovies = (req, res, next) => {
  movieModel.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(() => {
      next(new InternalServerError('Произошла ошибка выгрузки карточек с сервера'));
    });
};

export const createMovies = (req, res, next) => {
  movieModel.create({ ...req.body, owner: req.user._id })
    .then((newMovie) => res.send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(err);
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка сервера'));
      }
    });
};

export const deleteMovies = (req, res, next) => {
  movieModel.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка не найдена');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Доступ запрещен');
      } else {
        return movie.remove();
      }
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка удаление карточки с сервера'));
      }
    });
};
