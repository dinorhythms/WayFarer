import express from 'express';

import auth from './auth';
import trips from './trips';
import bookings from './bookings';

const v1 = express.Router();

v1.use('/auth', auth);
v1.use('/trips', trips);
v1.use('/bookings', bookings);

export default v1;