import express from 'express';

const users = express.Router();

/* GET users listing. */
users.get('/', function(req, res, next) {
  res.send('users side router extension respond with a resource');
});

export default users;
