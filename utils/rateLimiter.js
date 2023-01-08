import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message:
    'Вы превысили количество запросов в час!',
});
