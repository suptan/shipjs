import express from 'express';
import models from 'models';
import asyncWrapper from 'middlewares/async-wrapper';

const router = express.Router();

/**
 * @swagger
 * /api/latest/ship:
 *  get:
 *    description: get all available ship
 *    tags: [Ship]
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *              type: array
 *              items:
 *                $ref: '#definitions/baseShip'
 */
router.get('/ship', asyncWrapper(async (_, res) => {
  console.log('foo');
  
  const result = await models.ship.findAll();

  res.status(!result ? 204 : 200).send({
    data: result,
  });
}));

export default router;

/**
 * @swagger
 * tags:
 *  - name: Ship
 * definitions:
 *  baseShip:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *      name:
 *        type: string
 *      size:
 *        type: integer
 *  ship:
 *    allOf:
 *      - $ref: '#definitions/baseShip'
 */
