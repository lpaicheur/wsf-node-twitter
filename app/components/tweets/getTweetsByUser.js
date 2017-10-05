/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);

module.exports = (req, res) => {
  if (!req.params.user_id || typeof req.params.user_id !== 'string') {
    res.json({
      errors: ['user_id is not valid'],
      data: {},
    });
  }

  config.DB('tweets')
    .join('users', 'tweets.user_id', 'users.id')
    .select('tweets.id', 'tweets.message', 'tweets.retweeted_from', 'tweets.created_at', 'users.first_name', 'users.last_name').where({
      'tweets.user_id': req.params.user_id,
      'tweets.deleted_at': null,
    })
    .then(function (rows) {
      return res.json({
        errors: [],
        data: rows,
      });
    })
    .catch(function () {
      return res.json({
        errors: ['an error occured fetching data'],
        data: {},
      });
    });
};
