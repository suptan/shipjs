import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import { keys, pick } from 'lodash/fp';
import asyncWrapper from 'middlewares/async-wrapper';
import { level } from 'domains';
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

router.get('/gameplay', asyncWrapper(async (req, res) => {
  // console.log(req);

  const result = await level.findOneById(10);
  
  console.log(result);
  
  res.send({
    statusCode: 200,
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
    // try {
    const result = await gameplay.create(body);
    // const result = { body };
    res.send({
      statusCode: '200',
      data: result,
    });
    // } catch (error) {

    //   console.log(error);
      
    //   res.send({...error});
    // }
  }),
);

export default router;
