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

  config.DB('tweets')
    .join('users', 'tweets.user_id', 'users.id')
    .select('users.first_name', 'users.last_name', 'tweets.id', 'tweets.message', 'tweets.retweeted_from', 'tweets.created_at')
    .where({
      'tweets.user_id': req.params.user_id,
      'tweets.deleted_at': null,
    })
    .then(function (rows) {
      const tweets = rows.map(row => ({
        id: row.id,
        message: row.message,
        created_at: row.created_at,
        retweeted_from: row.retweeted_from,
      }));
      const data = {
        user: {
          id: req.params.user_id,
          first_name: rows[0].first_name,
          last_name: rows[0].last_name,
        },
        tweets,
      };
      return res.json({
        errors: [],
        data,
      });
    })
    .catch(function () {
      return res.json({
        errors: ['an error occured fetching data'],
        data: {},
      });
    });
};
