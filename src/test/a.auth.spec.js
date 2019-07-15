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

const signUpUser = { 'email': 'ola@gmail.com', 'password': 'password', 'first_name': 'ola', 'last_name': 'oloyede', 'is_admin': false }
const signUpIncomplete = { 'email': 'ola@gmail.com', 'password': 'password', 'is_admin': false }
const signUpAdmin = { 'email': 'olaadmin.ola@gmail.com', 'password': 'password', 'first_name': 'ola', 'last_name': 'oloyede', 'is_admin': true }
const signin = { 'email': 'ola@gmail.com', 'password': 'password'}
const signinNot = { 'email': 'olaaaaaaaaa@gmail.com', 'password': 'password'}
const signinIncomplete = { 'password': 'password'}

describe('#Signup POST', function () {

    before(function(done){
        this.timeout(10000)
        const one = pool.query(`TRUNCATE users CASCADE`);
        done()
    });

    it('Should sign up as user successfully', function (done) {
        this.timeout(10000)
        request
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'application/json')
        .send(signUpUser)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });

    it('Should sign up as admin successfully', function (done) {
        this.timeout(10000)
        request
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'application/json')
        .send(signUpAdmin)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            res.body.data.is_admin.should.be.equal(true);
            done();
        });
    });

    it('Should not sign up if user exist', function (done) {
        request
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'application/json')
        .send(signUpUser)
        .end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('status');
            res.body.should.have.property('error');
            done();
        });
    });

    it('Should not sign up with incomplete fields', function (done) {
        request
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'application/json')
        .send(signUpIncomplete)
        .end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('status');
            res.body.should.have.property('error');
            done();
        });
    });
  
});

describe('#Signin POST', function () {

    this.timeout(10000)

    it('Should signin as user successfully', function (done) {
        request
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send(signin)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            done();
        });
    });

    it('Should not signin if user doesnt exist', function (done) {
        request
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send(signinNot)
        .end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('status');
            res.body.should.have.property('error');
            done();
        });
    });

    it('Should not signin with incomplete fields', function (done) {
        request
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send(signinIncomplete)
        .end(function (err, res) {
            res.should.have.status(400);
            res.body.should.have.property('status');
            res.body.should.have.property('error');
            done();
        });
    });
  
});