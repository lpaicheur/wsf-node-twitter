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
      'tweets.created_at',
      'tweets.retweeted_from',
      'users.username',
      'users.first_name',
      'users.last_name',
      'retweets.message as retweets_message',
      'retweets.created_at as retweets_created_at',
      'retweets.user_id as retweets_user_id',
    )
    .leftJoin('tweets', 'likes.tweet_id', 'tweets.id')
    .leftJoin('users', 'tweets.user_id', 'users.id')
    .where('likes.user_id', req.params.user_id)
    .then(function (rows) {
      console.log(rows);
      const likes = rows.map((row) => {
        let retweet = null;
        if (row.retweeted_from) {
          retweet = {
            tweet_id: row.retweeted_from,
            message: row.retweets_message,
            created_at: row.retweets_created_at,
            user: {
              user_id: row.retweets_user_id,
            },
          };
        }
        return {
          like_id: row.id,
          created_at: row.likes_created_at,
          tweet: {
            tweet_id: row.tweet_id,
            message: row.message,
            created_at: row.created_at,
            user: {
              user_id: row.user_id,
              username: row.username,
              last_name: row.last_name,
              first_name: row.first_name,
            },
            retweeted_from: retweet,
          },
        };
      });
      const data = {
        user: {
          user_id: req.params.user_id,
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
