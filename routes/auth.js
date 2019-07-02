import express from 'express';

const auth = express.Router();

/* GET users listing. */
auth.get('/', function (req, res, next) {
    res.send('users auth');
});

export default auth;
