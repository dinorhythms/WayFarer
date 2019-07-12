import express from 'express';
import tripController from '../controllers/tripController';
import userRouteAuth, { adminRouteAuth } from '../middlewares/auth';

const trips = express.Router();

// @route   POST api/v1/trips
// @desc    Create trip
// @access  Private
// @role    Admin only
// trips.post('/', tripController.createTrip);
trips.post('/', adminRouteAuth, tripController.createTrip);
// trips.post('/', (req, res)=>{
//     res.send("Hi there")
// });

// @route   GET api/v1/trips
// @desc    Get all trips
// @access  Private
// @role    Admin or User
// trips.get('/', userRouteAuth, tripController.getTrips);

export default trips;
