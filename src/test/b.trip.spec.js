import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv'
import app from '../app';

var request = require("supertest").agent(app.listen());

dotenv.config();

chai.use(chaiHttp);
const should = chai.should();

const signInAdmin = { 'email': 'olaadmin.ola@gmail.com', 'password': 'password' }
const signInUser = { 'email': 'ola@gmail.com', 'password': 'password' }

let adminUser = null;
let normalUser = null;

let bus = {
    "bus_id": 6,
    "plate_number": "BLY 201 IKT",
    "manufacturer": "toyota",
    "model": "hilux",
    "year": "2012",
    "capacity": 36
}

let trip = { "bus_id": 6, "origin": "lagos", "destination": "ibadan", "trip_date": "2050-01-01 12:00:00", "fare": 50000 }
let InsertedTrip = null;

describe('#Trip Test', function () {

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
        this.timeout(10000)
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

    it('Should not create without token', function (done) {
        this.timeout(10000)
        request
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .send(trip)
        .end(function (err, res) {
            res.should.have.status(401);
            res.body.should.have.property('status');
            res.body.should.have.property('error');
            done();
        });
    });

    it('Should get all trips for user', function (done) {
        this.timeout(10000)
        request
        .get('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('token', normalUser.token)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });

    it('Should get all filter by destination trips for user', function (done) {
        this.timeout(10000)
        request
        .get('/api/v1/trips/destination/ibadan')
        .set('Content-Type', 'application/json')
        .set('token', normalUser.token)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });

    it('Should get all filter by origin trips for user', function (done) {
        this.timeout(10000)
        request
        .get('/api/v1/trips/origin/lagos')
        .set('Content-Type', 'application/json')
        .set('token', normalUser.token)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });

    it('Should patch to cancel trip by admin', function (done) {
        this.timeout(10000)
        request
        .patch(`/api/v1/trips/${InsertedTrip.id}`)
        .set('Content-Type', 'application/json')
        .set('token', adminUser.token)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });
  
});

