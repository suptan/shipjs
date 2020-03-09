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

/**
 * @swagger
 * /api/latest/gameplay:
 *  get:
 *    description: get game information by id
 *    tags: [Gameplay]
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: true
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

router.get('/gameplay/:id', asyncWrapper(async (req, res) => {
  const { id } = req.params || {};
  const { include } = req.query || {};

  const result = await gameplay.findFullGameInfoById(id, include);

  res.status(!result ? 204 : 200).send({
    data: result,
  });
}));

/**
 * @swagger
 * /api/latest/gameplay:
 *  post:
 *    description: create game session
 *    tag: [Gameplay]
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


/**
 * @swagger
 * tags:
 *  - name: Gameplay
 * definitions:
 *  baseGameplay:
 *    type: object
 *    required:
 *      - levelId
 *      - players
 *    properties:
 *      levelId:
 *        type: integer
 *      players:
 *        type: array
 *        items:
 *          type: object
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: integer
 *  createGameplay:
 *    type: object
 *    required:
 *      - levelId
 *      - players
 *    properties:
 *      levelId:
 *        type: integer
 *      players:
 *        type: array
 *        items:
 *          type: object
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: integer
 *  gameplay:
 *    allOf:
 *      - $ref: '#/definitions/baseGameplay'
 */
