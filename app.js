import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

dotenv.config();

const config = dotenv.config({ path: path.resolve(process.env.NODE_ENV === 'production' ? '.env' : '.env.common') }).parsed;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});