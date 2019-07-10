import '@babel/polyfill';
import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import v1 from './routes/index';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

dotenv.config();

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', v1);
app.use('/', v1);

app.get('*', (req, res) => res.status(200).json({success:'WayFarer!!!'}));

const port = parseInt(process.env.PORT, 10) || 4000;
app.listen(port, () => console.log(`Live at ${port}`));
  
export default app;