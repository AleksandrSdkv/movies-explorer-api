import { Joi, celebrate } from 'celebrate';
import { regexpUrl } from '../utils/constants.js';

export const moviesValid = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).required(),
    director: Joi.string().min(2).required(),
    duration: Joi.number().min(0.1).required(),
    year: Joi.string().min(4).max(4).required(),
    description: Joi.string().min(2).required(),
    image: Joi.string()
      .pattern(regexpUrl)
      .uri({ scheme: ['http', 'https'] })
      .required(),
    trailerLink: Joi.string()
      .pattern(regexpUrl)
      .uri({ scheme: ['http', 'https'] })
      .required(),
    thumbnail: Joi.string()
      .pattern(regexpUrl)
      .uri({ scheme: ['http', 'https'] })
      .required(),
    movieId: Joi.number().min(1).required(),
    nameRU: Joi.string().min(2).required(),
    nameEN: Joi.string().min(2).required(),
  }),
});

export const validMoviesId = celebrate({
  params: Joi.object({
    _id: Joi.string().hex().length(24).required(),
  }).required(),
});
