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

// @route   DELETE api/v1/booking/:bookingId
// @desc    delete booking
// @access  Private
// @role    User
bookings.delete('/:bookingId', userRouteAuth, bookingController.deleteBooking);

export default bookings;
