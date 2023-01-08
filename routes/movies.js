import { Router } from 'express';
import {
  getMovies,
  createMovies,
  deleteMovies,
} from '../controllers/movies.js';
import { validMoviesId, moviesValid } from '../validators/moviesValidators.js';

export const movieRouter = Router();

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', moviesValid, createMovies);
movieRouter.delete('/movies/_id', validMoviesId, deleteMovies);
