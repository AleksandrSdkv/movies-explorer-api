import { movieModel } from '../models/movie.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const getMovies = (req, res, next) => {
  movieModel.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(() => {
      next(new InternalServerError('Произошла ошибка выгрузки фильмов с сервера'));
    });
};

export const createMovies = (req, res, next) => {
  req.body.owner = req.user._id;
  movieModel.create(req.body)
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка сервера'));
      }
    });
};

export const deleteMovies = (req, res, next) => {
  movieModel.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм не найден'));
      } else if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Доступ запрещен'));
      } else {
        movie.remove();
        res.send(movie);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка удаление фильма с сервера'));
      }
    });
};
