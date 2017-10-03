require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users', (req, res) => {
  const errors = [];
  const params = {
    username: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    first_name: {
      type: 'string',
    },
    last_name: {
      type: 'string',
    },
  };

  _.forEach(params, (value, key) => {
    const reqValue = req.body[key];
    const param = params[key];

    // eslint-disable-next-line valid-typeof
    if (typeof reqValue !== param.type) {
      errors.push(`${key} is not valid`);
    }
  });

  const { username, email, first_name, last_name } = req.body;

  db('users').insert({
    username,
    email,
    first_name,
    last_name,
  })
    .then(() => res.json({
      errors,
      data: req.body,
    }))
    .catch((err) => {
      console.log(err);
      return res.json({
        statusCode: 201,
        errors: 'error inserting',
        data: {},
      });
    });
});

app.get('/users', (req, res) => {
  db('users').select('username', 'email', 'first_name', 'last_name', 'created_at')
    .then(users => res.json({
      statusCode: 200,
      errors: [],
      users,
    }))
    .catch(err => res.json({
      errors: ['error while getting users'],
      data: {},
    }));
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
