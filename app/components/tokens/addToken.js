/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);
const schema = require('../../schema');

module.exports = (req, res) => {
  if (schema.token(req.body.api_key).error) {
    return res.json({
      errors: ['api_key is not valid'],
      data: {},
    });
  }

  if (schema.token(req.body.api_token).error) {
    return res.json({
      errors: ['api_token is not valid'],
      data: {},
    });
  }

  const { api_key, api_token } = req.body;

  config.DB('tokens')
    .insert({
      user_id: req.user_id,
      api_key,
      api_token,
    })
    .then(function () {
      return res.status(201).json({
        errors: [],
        data: {
          api_key,
          api_token,
        },
      });
    })
    .catch(function () {
      return res.json({
        errors: ['error inserting message'],
        data: {},
      });
    });
};
