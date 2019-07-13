import express from 'express';
import bookingController from '../controllers/bookingController';
import userRouteAuth, { adminRouteAuth } from '../middlewares/auth';

const bookings = express.Router();

// @route   POST api/v1/bookings
// @desc    Create booking
// @access  Private
// @role    Users
bookings.post('/', userRouteAuth, bookingController.createBooking);


// @route   GET api/v1/bookings
// @desc    Get all bookings
// @access  Private
// @role    User
bookings.get('/', userRouteAuth, bookingController.getAllBookings);

export default bookings;
