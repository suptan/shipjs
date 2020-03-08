import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import { keys, pick } from 'lodash/fp';
import asyncWrapper from 'middlewares/async-wrapper';
import { gameplay } from 'services';

const router = express.Router();

const isNumber = Joi.number();
const isArray = Joi.array();

const playerSchema = {
  id: isNumber.required()
};
const createGamePlaySchema = {
  levelId: isNumber.required(),
  players: isArray.items(Joi.object(playerSchema)).required(),
};

router.get('/gameplay/:id', asyncWrapper(async (req, res) => {
  const { id } = req.params || {};
  const { include } = req.query || {};

  const result = await gameplay.findFullGameInfoById(id, include);
  
  console.log(result);
  
  res.status(!result ? 204 : 200).send({
    data: result,
  });
}));

/**
 * @swagger
 * /gameplay:
 *  post:
 *    description: create game session
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        schema:
 *          type: object
 *          properties:
 *            statusCode:
 *              type: string
 *              enum:
 *                - '200'
 *            data:
 *              type: object
 */
router.post(
  '/gameplay',
  validate({
    body: Joi.object().keys(createGamePlaySchema),
  }),
  asyncWrapper(async (req, res) => {
    const body = pick(keys(createGamePlaySchema), req.body);
    const result = await gameplay.create(body);
    res.send({
      statusCode: '200',
      data: result,
    });
  }),
);

export default router;
