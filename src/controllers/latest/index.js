import express from 'express';
import errorHandle from 'middlewares/error-handle';
import gameplay from './gameplay';
import playerFleet from './player-fleet';
import playerMap from './player-map';

const controllers = [
  gameplay,
  playerFleet,
  playerMap,
];

const api = express.Router();
api.use(controllers);
api.use(errorHandle);

export default api;
