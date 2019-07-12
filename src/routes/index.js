import express from 'express';
import auth from './auth';
import trips from './trips';

const v1 = express.Router();

v1.use('/auth', auth);
v1.use('/trips', trips);

export default v1;