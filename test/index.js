/* eslint-env mocha */

process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/index');

const expect = chai.expect;

const user = {
  id: '3f6889ee-b4d2-4629-99df-cabc09ef9c40',
};

chai.use(chaiHttp);

const checkSuccesArrayStructure = (res) => {
  const { data, errors } = res.body;
  expect(data).to.be.an('array');
  expect(errors).to.be.an('array');
  expect(errors.length).to.be.eql(0);
};

const checkSuccesObjectStructure = (res) => {
  const { data, errors } = res.body;
  expect(data).to.be.an('object');
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
        checkSuccesArrayStructure(res);
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
        checkSuccesArrayStructure(res);
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

describe('/GET users/:user_id/tweets', () => {
  it('it should GET the user\'s tweets', (done) => {
    chai.request(server)
      .get(`/users/${user.id}/tweets`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        checkSuccesObjectStructure(res);
        expect(res.body.data).to.have.all.keys(
          'user',
          'tweets',
        );
        expect(res.body.data.user).to.have.all.keys(
          'user_id',
          'username',
          'first_name',
          'last_name',
        );
        expect(res.body.data.tweets[0]).to.have.all.keys(
          'tweet_id',
          'message',
          'created_at',
          'retweeted_from',
        );
        expect(res.body.data.tweets).to.be.an('array');
        done();
      });
  });
});

describe('/GET users/:user_id/likes', () => {
  it('it should GET the user\'s likes', (done) => {
    chai.request(server)
      .get(`/users/${user.id}/likes`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        checkSuccesObjectStructure(res);
        expect(res.body.data).to.have.all.keys(
          'user',
          'likes',
        );
        expect(res.body.data.likes).to.be.an('array');
        expect(res.body.data.user).to.have.all.keys(
          'user_id',
          'username',
          'first_name',
          'last_name',
        );
        expect(res.body.data.likes[0]).to.have.all.keys(
          'like_id',
          'created_at',
          'tweet',
        );
        expect(res.body.data.likes[0].tweet).to.have.all.keys(
          'tweet_id',
          'message',
          'created_at',
          'user',
          'retweeted_from',
        );
        done();
      });
  });
});

describe('/POST users', () => {
  it('it should POST a new user', (done) => {
    chai.request(server)
      .post('/users')
      .send({
        username: 'mocha',
        email: 'mocha@test.fr',
        first_name: 'mocha',
        last_name: 'test',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        checkSuccesObjectStructure(res);
        expect(res.body.data).to.have.all.keys(
          'user_id',
          'username',
          'email',
          'first_name',
          'last_name',
        );
        done();
      });
  });
});
