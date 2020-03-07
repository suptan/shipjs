import express from 'express';
import config from './config';
import { checkConnection } from './models';
import { version } from '../package.json';

const { PORT } = config;
const port = PORT;
const app = express();

app.get('/', async (_, res) => {
  const databaseConnection = await checkConnection();

  return res.status(200).json({
    databaseConnection,
    version,
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
