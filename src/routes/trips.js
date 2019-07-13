import express from 'express';
import tripController from '../controllers/tripController';
import userRouteAuth, { adminRouteAuth } from '../middlewares/auth';

const trips = express.Router();

// @route   POST api/v1/trips
// @desc    Create trip
// @access  Private
// @role    Admin only
trips.post('/', adminRouteAuth, tripController.createTrip);


// @route   GET api/v1/trips
// @desc    Get all trips
// @access  Private
// @role    Admin or User
trips.get('/', userRouteAuth, tripController.getTrips);

// @route   GET api/v1/trips/destination/:destination
// @desc    Get all filtered trips by destination
// @access  Private
// @role    Admin or User
trips.get('/destination/:destination', userRouteAuth, tripController.filterTripsByDestination);

// @route   GET api/v1/trips/origin/:origin
// @desc    Get all filtered trips by origin
// @access  Private
// @role    Admin or User
trips.get('/origin/:origin', userRouteAuth, tripController.filterTripsByOrigin);

// @route   PATCH api/v1/trips/:tripId
// @desc    cancel trip
// @access  Private
// @role    Admin 
trips.patch('/:tripId', adminRouteAuth, tripController.cancelTrip);

export default trips;
