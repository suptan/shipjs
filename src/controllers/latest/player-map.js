import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import { keys, pick } from 'lodash/fp';
import asyncWrapper from 'middlewares/async-wrapper';
import { playerMap } from 'services';

const router = express.Router();

const isNumber = Joi.number();
const isPositive = Joi.number().positive().allow(0);

const createPlayerDamageSchema = {
  attackerId: isNumber.required(),
  gameplayPlayerId: isNumber.required(),
  seizedCoordinateX: isPositive.required(),
  seizedCoordinateY: isPositive.required(),
};

router.post(
  '/player-map',
  validate({
    body: Joi.object().keys(createPlayerDamageSchema)
  }),
  asyncWrapper(async (req, res) => {
    const body = pick(keys(createPlayerDamageSchema), req.body);
    const result = await playerMap.create(body);
    res.send({
      statusCode: '200',
      data: result
    });
  })
);

export default router;
