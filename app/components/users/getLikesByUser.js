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

  config.DB('likes')
    .where('likes.user_id', req.params.user_id)
    .join('tweets', 'likes.tweet_id', 'tweets.id')
    .select(
      'likes.id',
      'likes.tweet_id',
      'tweets.id',
      'tweets.message',
      'tweets.user_id',
      'tweets.retweeted_from',
      'tweets.created_at',
    )
    .then(function (rows) {
      console.log(rows);
      const likes = rows.map(row => ({
        id: row.id,
        created_at: row.created_at,
        message: row.message,
        retweeted_from: row.retweeted_from,
        user_id: row.user_id,
      }));
      const data = {
        user: {
          id: req.params.user_id,
        },
        likes,
      };
      return res.json({
        errors: [],
        data,
      });
    })
    .catch(function (err) {
      console.log(err);
      return res.json({
        errors: ['an error occured fetching followers'],
        data: {},
      });
    });
};
