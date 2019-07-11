import express from 'express';
import auth from './auth';

const v1 = express.Router();

v1.use('/auth', auth);

export default v1;