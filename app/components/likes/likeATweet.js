/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);
const schema = require('../../schema');

module.exports = (req, res) => {
  if (schema.id(req.params.tweet_id).error) {
    return res.json({
      errors: ['tweet_id is not valid'],
      data: {},
    });
  }

  const { tweet_id } = req.params;

  config.DB('likes')
    .insert({
      user_id: req.user_id,
      tweet_id,
    })
    .then(function () {
      return res.status(201).json({
        errors: [],
        data: { user_id: req.user_id, tweet_id },
      });
    })
    .catch(function () {
      return res
        .status(400)
        .json({
          errors: ['error inserting like'],
          data: {},
        });
    });
};
