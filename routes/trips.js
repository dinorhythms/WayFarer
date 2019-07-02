import express from 'express';

const trips = express.Router();

/* GET users listing. */
trips.get('/', function (req, res, next) {
    res.send('trips routes');
});

export default trips;
