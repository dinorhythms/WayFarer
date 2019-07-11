import express from 'express';
import authController from '../controllers/authController';
import userRouteAuth from '../middlewares/auth';

const auth = express.Router();

// @route   POST api/v1/auth/signup
// @desc    User signup
// @access  Public
auth.post('/signup', authController.signUp);

export default auth;