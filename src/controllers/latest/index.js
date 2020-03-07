import express from 'express';
import errorHandle from 'middlewares/error-handle';
import gameplay from './gameplay';

const controllers = [
  gameplay
];

const api = express.Router();
api.use(controllers);
api.use(errorHandle);

export default api;
