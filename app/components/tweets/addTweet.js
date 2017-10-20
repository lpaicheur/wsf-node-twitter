/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);
const schema = require('../../schema');

module.exports = (req, res) => {
  if (schema.id(req.params.user_id).error) {
    return res.json({
      errors: ['user_id is not valid'],
      data: {},
    });
  }

  if (schema.tweet(req.body.message).error) {
    return res.json({
      errors: ['message is not valid'],
      data: {},
    });
  }

  const { message } = req.body;

  config.DB('tweets')
    .insert({
      user_id: req.user_id,
      message,
    })
    .then(function () {
      return res.status(201).json({
        errors: [],
        data: { message: req.body.message },
      });
    })
    .catch(function () {
      return res
        .status(400)
        .json({
          errors: ['error inserting message'],
          data: {},
        });
    });
};
