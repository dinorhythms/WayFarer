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

let token = '';

before(function (done) {
  this.timeout(10000)
  const query = `
  DELETE FROM users;
  DELETE FROM buses;
  DELETE FROM trips;
  DELETE FROM bookings;
  `
  const query2 = `INSERT INTO buses (number_plate, manufacturer, model, year, capacity )VALUES ('BLY 201 IKT','toyota','Hilux','2006',11)`
  const result = pool.query(query)
  done();
});

describe('# User Signup POST', function () {
  this.timeout(10000)
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

describe('# User Signin POST', function () {
  this.timeout(10000)
  describe('POST signin successfully', function () {
    it('Should signin successfully', function (done) {
      request
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send({ 'email': 'ola@gmail.com', 'password': 'password' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          token = res.body.data.token;
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

  describe('POST check user existence api/v1/auth/signin', function () {
    it('should return user does not exist', function (done) {
      request
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send({ 'email': 'larry@gmail.com', 'password': 'password' })
        .expect(400)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.a('string');
          res.body.status.should.be.equal('error');
          res.body.data.should.be.equal('User does not exist');
          done();
        });
    });
  });

  describe('POST check wrong password api/v1/auth/signin', function () {
    it('should return invalid credential', function (done) {
      request
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send({ 'email': 'ola@gmail.com', 'password': 'passwordy' })
        .expect(400)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.a('string');
          res.body.status.should.be.equal('error');
          res.body.data.should.be.equal('Invalid Credentials');
          done();
        });
    });
  });

});

describe('# Authenticated User Token', function () {
  this.timeout(10000)
  describe('GET successful', function () {
    it('Should be successfully', function (done) {
      request
        .get('/api/v1/auth/user')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
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
          done();
        });
    });
  });

  describe('GET failed auth', function () {
    it('Should be return authorization denied', function (done) {
      request
        .get('/api/v1/auth/user')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) return done(err);
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.status.should.be.equal('error');
          res.body.data.should.be.equal('No token, authorization denied');
          done();
        });
    });
  });

});

describe('# Admin Only Creates Trips', function () {
  this.timeout(10000)
  describe('POST successful', function () {
    it('Should be successfully', function (done) {
      request
        .post('/api/v1/trips')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});