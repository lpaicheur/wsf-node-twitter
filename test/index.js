/* eslint-env mocha */

process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/index');

const expect = chai.expect;

const user = {
  id: 'c57ac4db-4514-4582-9bb5-bd73541cac1e',
};

chai.use(chaiHttp);

const checkSuccesStructure = (res) => {
  const { data, errors } = res.body;
  expect(data).to.be.an('array');
  expect(errors).to.be.an('array');
  expect(errors.length).to.be.eql(0);
};

const checkErrorStructure = (res) => {
  const { data, errors } = res.body;
  expect(data).to.be.an('object');
  expect(errors).to.be.an('array');
  expect(errors.length).to.be.not.eql(0);
};

describe('/GET users', () => {
  it('it should GET all the users', (done) => {
    chai.request(server)
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        checkSuccesStructure(res);
        expect(res.body.data[0]).to.have.all.keys(
          'user_id',
          'username',
          'email',
          'first_name',
          'last_name',
          'created_at',
        );
        done();
      });
  });
});

describe('/GET users/:user_id/info', () => {
  it('it should GET the user\'s infos', (done) => {
    chai.request(server)
      .get(`/users/${user.id}/info`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        checkSuccesStructure(res);
        expect(res.body.data[0]).to.have.all.keys(
          'user_id',
          'username',
          'email',
          'first_name',
          'last_name',
          'created_at',
        );
        done();
      });
  });
  it('it should GET the user\'s infos and return error', (done) => {
    chai.request(server)
      .get('/users/123456/info')
      .end((err, res) => {
        expect(res).to.have.status(200);
        checkErrorStructure(res);
        done();
      });
  });
});
