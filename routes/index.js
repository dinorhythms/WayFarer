import express from 'express';

import auth from './auth';
import trips from './trips';
import users from './users';

const v1 = express.Router();

v1.use('/auth', auth);
v1.use('/trips', trips);
v1.use('/users', users);

v1.get('/', function(req, res, next) {
  res.send('hello dino')
});

export default v1;