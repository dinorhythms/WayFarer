import chai from 'chai';
import chaiHttp from 'chai-http';
import { Pool } from 'pg';
import dotenv from 'dotenv'
import app from '../app';

var request = require("supertest").agent(app.listen());

dotenv.config();
chai.use(chaiHttp);
const should = chai.should();

const pool = new Pool({ connectionString: process.env.TEST_DB_URL });

before(function (done) {
  this.timeout(10000)
  const query = `
  DELETE FROM users;
  DELETE FROM buses;
  DELETE FROM trips;
  DELETE FROM bookings;
  `
  const result = pool.query(query)
  done();
});

describe('Test User Registration POST api/v1/auth/signup', function () {
  describe('POST sign up successful', function () {
    it('Should sign up successful', function (done) {
      request
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({ 'email': 'ola@gmail.com', 'password': 'password', 'first_name': 'ola', 'last_name': 'oloyede' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.status.should.be.a('string');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('user_id');
          res.body.data.should.have.property('is_admin');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('token');
          done();
        });
    });
  });

  describe('POST check email exists api/v1/auth/signup', function () {
    it('should return user with this email already exist', function (done) {
      request
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({ 'email': 'ola@gmail.com', 'password': 'password', 'first_name': 'ola', 'last_name': 'oloyede' })
        .expect(400)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.a('string');
          res.body.status.should.be.equal('error');
          res.body.data.should.be.equal('User exist already');
          done();
        });
    });
  });

  describe('POST check fields are required api/v1/auth/signup', function () {
    it('should make sure all fields are required', function (done) {
      request
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/json')
        .send({ 'last_name': 'oloyede' })
        .expect(400)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.a('string');
          res.body.status.should.be.equal('error');
          res.body.data.should.be.equal('All fields are required');
          done();
        });
    });
  });

});