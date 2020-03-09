import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
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

const swaggerJSDocOptions = {
  definition: {
    info: {
      title: 'Battleship Game',
      version: '1.0.0',
    },
  },
  apis: ['./src/controllers/latest/*.js'],
};
const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);

app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api/latest', vLatest);
app.use(`/api/latest/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

if (config.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

export { app };
