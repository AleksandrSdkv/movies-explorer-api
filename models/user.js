import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

const User = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Александр',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Неправильный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

User.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверный логин или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неверный логин или пароль'));
          }
          return user;
        });
    });
};

export const userModel = mongoose.model('user', User);
