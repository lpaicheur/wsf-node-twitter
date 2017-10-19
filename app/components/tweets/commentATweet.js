/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);
const schema = require('../../schema');

module.exports = (req, res) => {
  if (schema.id(req.params.tweet_id).error) {
    return res.json({
      errors: ['user_id is not valid'],
      data: {},
    });
  }

  if (schema.message(req.body.message).error) {
    return res.json({
      errors: ['message is not valid'],
      data: {},
    });
  }

  const { message } = req.body;

  config.DB('comments')
    .insert({
      user_id: req.user_id,
      tweet_id: req.params.tweet_id,
      message,
    })
    .then(function () {
      return res.status(201).json({
        errors: [],
        data: { message: req.body.message },
      });
    })
    .catch(function () {
      return res.json({
        errors: ['error inserting message'],
        data: {},
      });
    });
};
