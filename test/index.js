/* eslint-env mocha */

process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/index');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/GET users', () => {
  it('it should GET all the users', (done) => {
    chai.request(server)
      .get('/users')
      .end((err, res) => {
        const { data, errors } = res.body;
        expect(res).to.have.status(200);
        expect(data).to.be.an('array');
        expect(errors.length).to.be.eql(0);
        done();
      });
  });
});
