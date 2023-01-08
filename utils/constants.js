import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
export const regexpUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/i;
export const config = dotenv.config({ path: path.resolve(process.env.NODE_ENV === 'production' ? '.env' : '.env.common') }).parsed;
