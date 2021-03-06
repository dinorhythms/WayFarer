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
// @role    User and Admin
bookings.get('/', userRouteAuth, bookingController.getAllBookings);

// @route   DELETE api/v1/bookings/:bookingId
// @desc    delete booking
// @access  Private
// @role    User
bookings.delete('/:bookingId', userRouteAuth, bookingController.deleteBooking);

// @route   POST api/v1/bookings/changeseat
// @desc    change seat
// @access  Private
// @role    User
bookings.post('/changeseat', userRouteAuth, bookingController.changeSeat);

export default bookings;
