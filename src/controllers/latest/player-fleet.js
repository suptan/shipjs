import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import { keys, pick } from 'lodash/fp';
import asyncWrapper from 'middlewares/async-wrapper';
import { playerFleet } from 'services';
import { gameplayPlayer } from 'domains';

const router = express.Router();

const isNumber = Joi.number();
const isPositive = Joi.number().positive().allow(0);

const createPlayerFleetSchema = {
  gameplayPlayerId: isNumber.required(),
  shipId: isNumber.required(),
  headCoordinateX: isPositive.required(),
  headCoordinateY: isPositive.required(),
  tailCoordinateX: isPositive.required(),
  tailCoordinateY: isPositive.required(),
};

router.get('/player-fleet', asyncWrapper(async (req, res) => {
  // get all ship status and position
  const result = await gameplayPlayer.findOneWithMapById(1);
  res.send({
    statusCode: '200',
    data: result,
  });
}));


/**
 * @swagger
 * /player-fleet:
 *  post:
 *    description: create play ship location in the game
 *    tag: [PlayerFleet]
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: obj
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/createGameplay'
 *    responses:
 *      200:
 *        schema:
 *          type: object
 *          properties:
 *            statusCode:
 *              type: string
 *              enum:
 *                - '200'
 */
router.post(
  '/player-fleet',
  validate({
    body: Joi.object().keys(createPlayerFleetSchema),
  }),
  asyncWrapper(async (req, res) => {
    const body = pick(keys(createPlayerFleetSchema), req.body);
    const result = await playerFleet.create(body);
    res.send({
      statusCode: '200',
      data: result,
    });
  })
);

export default router;

/**
 * @swagger
 * tags:
 *  - name: PlayerFleet
 * definitions:
 *  createPlayerFleet:
 *    type: object
 *    required:
 *      - gameplayPlayerId
 *      - shipId
 *      - headCoordinateX
 *      - headCoordinateY
 *      - tailCoordinateX
 *      - tailCoordinateY
 *    properties:
 *      gameplayPlayerId:
 *        type: integer
 *      shipId:
 *        type: integer
 *      headCoordinateX:
 *        type: integer
 *      headCoordinateY:
 *        type: integer
 *      tailCoordinateX:
 *        type: integer
 *      tailCoordinateY:
 *        type: integer
 */
