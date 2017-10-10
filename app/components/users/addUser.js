/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);
const schema = require('../../schema');

module.exports = (req, res) => {
  if (schema.user(req.body).error) {
    return res.json({
      errors: ['user is not valid'],
      data: {},
    });
  }

  const { username, email, first_name, last_name } = req.body;

  config.DB('users').insert({
    username,
    email,
    first_name,
    last_name,
  })
    .then(function () {
      return res.status(201).json({
        errors: [],
        data: req.body,
      });
    })
    .catch(function () {
      return res.json({
        errors: ['error inserting user, email or username may already be taken'],
        data: {},
      });
    });
};
