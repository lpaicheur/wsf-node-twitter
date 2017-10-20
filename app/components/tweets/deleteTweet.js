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

  config.DB('tweets')
    .where({
      id: req.params.tweet_id,
      user_id: req.user_id,
    })
    .update({
      updated_at: config.DB.raw('CURRENT_TIMESTAMP'),
      deleted_at: config.DB.raw('CURRENT_TIMESTAMP'),
    })
    .then(function () {
      return res
        .status(201)
        .json({
          errors: [],
          data: { tweet_id: req.params.tweet_id },
        });
    })
    .catch(function () {
      return res
        .status(400)
        .json({
          errors: ['error deleting tweet'],
          data: {},
        });
    });
};
