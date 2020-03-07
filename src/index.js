import express from 'express';
import models from 'models';
import config from './config';
import { checkConnection } from './models';

const { PORT } = config;
const port = PORT;
const app = express();

app.get('/', async (_, res) => {
  const databaseConnection = await checkConnection();
  console.log('foo', databaseConnection);
  console.log(await models.maps.findAll());

  return res.status(200).json('health check');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
