import mongoose from 'mongoose';
import { regexpUrl } from '../utils/constants.js';

const { Schema } = mongoose;

const Movie = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => regexpUrl.test(link),
      message: () => 'Требуется http(s) ссылка',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (link) => regexpUrl.test(link),
      message: () => 'Требуется http(s) ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,

  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export const movieModel = mongoose.model('movie', Movie);
