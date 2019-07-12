import express from 'express';
import authController from '../controllers/authController';
import userRouteAuth from '../middlewares/auth';

const auth = express.Router();

// @route   POST api/v1/auth/signup
// @desc    User signup
// @access  Public
auth.post('/signup', authController.signUp);

// @route   POST api/v1/auth/signin
// @desc    User signin
// @access  Public
auth.post('/signin', authController.signIn);

// @route   GET api/v1/auth/user
// @desc    Get User data
// @access  Private
auth.get('/user', userRouteAuth, authController.user);

export default auth;