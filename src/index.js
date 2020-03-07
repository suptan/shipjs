import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import { checkConnection } from './models';
import vLatest from './controllers/latest';
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

app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api/latest', vLatest);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
