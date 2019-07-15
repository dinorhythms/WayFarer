import chai from 'chai';
import chaiHttp from 'chai-http';
// import { Pool } from 'pg';
import dotenv from 'dotenv'
import app from '../app';

var request = require("supertest").agent(app.listen());

dotenv.config();

chai.use(chaiHttp);
const should = chai.should();

// const pool = new Pool({ connectionString: process.env.TEST_DB_URL });
const signInAdmin = { 'email': 'olaadmin.ola@gmail.com', 'password': 'password' }
const signInUser = { 'email': 'ola@gmail.com', 'password': 'password' }
let trip = { "bus_id": 6, "origin": "lagos", "destination": "ibadan", "trip_date": "2050-01-01 12:00:00", "fare": 50000 }

let adminUser = null;
let normalUser = null;
let InsertedTrip = null;
let booking = null;

describe('#Booking Test', function () {

    it('Should signin as admin successfully', function (done) {
        request
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send(signInAdmin)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            adminUser = res.body.data;
            done();
        });
    });

    it('Should signin as user successfully', function (done) {
        request
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send(signInUser)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            normalUser = res.body.data;
            done();
        });
    });

    it('Should create a new trip', function (done) {
        this.timeout(20000)
        request
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('token', adminUser.token)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(trip)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            InsertedTrip = res.body.data;
            done();
        });
    });

    it('Should create a booking by user', function (done) {
        this.timeout(10000)
        request
        .post('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('token', normalUser.token)
        .set('Authorization', `Bearer ${normalUser.token}`)
        .send({"trip_id": InsertedTrip.id})
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            booking = res.body.data;
            done();
        });
    });

    it('Should get all users bookings', function (done) {
        this.timeout(10000)
        request
        .get('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('token', normalUser.token)
        .set('Authorization', `Bearer ${normalUser.token}`)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });

    it('Should change seat number for user', function (done) {
        this.timeout(10000)
        request
        .post('/api/v1/bookings/changeseat')
        .set('Content-Type', 'application/json')
        .set('token', normalUser.token)
        .set('Authorization', `Bearer ${normalUser.token}`)
        .send({"booking_id": booking.id})
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });

    it('Should delete booking', function (done) {
        this.timeout(10000)
        request
        .delete(`/api/v1/bookings/${booking.id}`)
        .set('Content-Type', 'application/json')
        .set('token', normalUser.token)
        .set('Authorization', `Bearer ${normalUser.token}`)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });
  
});

