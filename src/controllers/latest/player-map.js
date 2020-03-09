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
  defenderId: isNumber.required(),
  seizedCoordinateX: isPositive.required(),
  seizedCoordinateY: isPositive.required(),
};

/**
 * @swagger
 * /api/latest/player-map:
 *  post:
 *    description: create attacker action and calculate defender damage
 *    tag: [PlayerMap]
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: obj
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/createPlayerMap'
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

/**
 * @swagger
 * tags:
 *  - name: PlayerFleet
 * definitions:
 *  createPlayerMap:
 *    type: object
 *    required:
 *      - attackerId
 *      - defenderId
 *      - seizedCoordinateX
 *      - seizedCoordinateY
 *    properties:
 *      attackerId:
 *        type: integer
 *      defenderId:
 *        type: integer
 *      seizedCoordinateX:
 *        type: integer
 *      seizedCoordinateY:
 *        type: integer
 */
