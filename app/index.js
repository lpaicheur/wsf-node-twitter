const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const validation = require('./validation');

const env = process.env.NODE_ENV || 'development';
const config = require(`./config/${env}`); // eslint-disable-line import/no-dynamic-require

const db = config.DB;

const app = express();

app.use(bodyParser.json());

const services = {
  users: {
    getAllUsers: require('./components/users/getAllUsers'),
  },
  tweets: {
    getTweetsByUser: require('./components/tweets/getTweetsByUser'),
  },
};

app.get('/', (req, res) => {
  res.send('Welcome to twitter');
});

app.get('/users', services.users.getAllUsers);

app.get('/users/:user_id/tweets', services.tweets.getTweetsByUser);

app.post('/users', (req, res) => {
  const errors = [];
  const params = {
    username: validation.username,
    email: validation.email,
    first_name: validation.first_name,
    last_name: validation.last_name,
  };

  _.forEach(params, (value, key) => {
    const reqValue = req.body[key];
    const param = params[key];
    const isValid = param(reqValue);

    if (!isValid.success) {
      errors.push(isValid.error);
    }
  });

  if (errors.length > 0) {
    return res.json({
      errors,
      data: {},
    });
  }

  const { username, email, first_name, last_name } = req.body;

  return db('users').insert({
    username,
    email,
    first_name,
    last_name,
  })
    .then(() => res.status(201).json({
      statusCode: 201,
      errors,
      data: req.body,
    }))
    .catch(() => res.json({
      errors: 'error inserting, email or username may already be taken',
      data: {},
    }));
});

app.put('/users/:id/info', (req, res) => {
  const errors = [];
  const params = {
    username: validation.username,
    email: validation.email,
    first_name: validation.first_name,
    last_name: validation.last_name,
  };

  _.forEach(params, (value, key) => {
    const reqValue = req.body[key];
    const param = params[key];
    const isValid = param(reqValue);

    if (!isValid.success) {
      errors.push(isValid.error);
    }
  });

  if (errors.length > 0) {
    return res.json({
      errors,
      data: {},
    });
  }

  const { username, email, first_name, last_name } = req.body;

  return db('users').where('id', req.params.id).update({
    username,
    email,
    first_name,
    last_name,
  })
    .then(() => res.status(201).json({
      statusCode: 201,
      errors,
      data: req.body,
    }))
    .catch(() => res.json({
      errors: 'error inserting, email or username may already be taken',
      data: {},
    }));
});

app.get('/users/:id/info', (req, res) => {
  db('users').select('username', 'email', 'first_name', 'last_name', 'created_at').where('id', req.params.id)
    .then(users => res.json({
      statusCode: 200,
      errors: [],
      data: users,
    }))
    .catch(() => res.json({
      errors: ['error while getting users'],
      data: {},
    }));
});

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${config.PORT}!`);
});
