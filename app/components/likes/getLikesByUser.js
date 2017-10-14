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
    .select(
      'likes.id',
      'likes.tweet_id',
      'likes.created_at as likes_created_at',
      'tweets.message',
      'tweets.user_id',
      'tweets.retweeted_from',
      'tweets.created_at',
      'users.username',
      'users.first_name',
      'users.last_name',
    )
    .join('tweets', 'likes.tweet_id', 'tweets.id')
    .join('users', 'tweets.user_id', 'users.id')
    .where('likes.user_id', req.params.user_id)
    .then(function (rows) {
      const likes = rows.map(row => ({
        id: row.id,
        created_at: row.likes_created_at,
        tweet: {
          id: row.tweet_id,
          created_at: row.created_at,
          message: row.message,
          user: {
            id: row.user_id,
            username: row.username,
            last_name: row.last_name,
            first_name: row.first_name,
          },
          retweeted_from: row.retweeted_from,
        },
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
