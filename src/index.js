import express from 'express';
import config from './config';

const { PORT } = config;
const port = PORT;
const app = express();

app.get('/', async (_, res) => {
  return res.status(200).json('health check');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
