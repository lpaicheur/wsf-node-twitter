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
      'users.username',
      'users.first_name',
      'users.last_name',
      'likes.id',
      'likes.tweet_id',
      'likes.created_at as likes_created_at',
      'tweets.message',
      'tweets.user_id',
      'tweets.created_at',
      'tweets.retweeted_from',
      'tweeting.username as tweeting_username',
      'tweeting.first_name as tweeting_first_name',
      'tweeting.last_name as tweeting_last_name',
      'retweets.message as retweets_message',
      'retweets.created_at as retweets_created_at',
      'retweets.user_id as retweets_user_id',
      'retweeting.username as retweeting_username',
      'retweeting.first_name as retweeting_first_name',
      'retweeting.last_name as retweeting_last_name',
    )
    .leftJoin('users', 'likes.user_id', 'users.id')
    .leftJoin('tweets', 'likes.tweet_id', 'tweets.id')
    .leftJoin('users as tweeting', 'tweets.user_id', 'tweeting.id')
    .leftJoin('tweets as retweets', 'tweets.retweeted_from', 'retweets.id')
    .leftJoin('users as retweeting', 'retweets.user_id', 'retweeting.id')
    .where({
      'likes.user_id': req.params.user_id,
      'likes.deleted_at': null,
      'tweets.deleted_at': null,
      'users.deleted_at': null,
    })
    .then(function (rows) {
      if (!rows.length) {
        return res.json({
          errors: ['no likes found'],
          data: {},
        });
      }
      const likes = rows.map((row) => {
        let retweet = null;
        // If tweet has been retweeted find the tweet and user that retweeted
        if (row.retweeted_from) {
          retweet = {
            tweet_id: row.retweeted_from,
            message: row.retweets_message,
            created_at: row.retweets_created_at,
            user: {
              user_id: row.retweets_user_id,
              username: row.retweeting_username,
              first_name: row.retweeting_first_name,
              last_name: row.retweeting_last_name,
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
              username: row.tweeting_username,
              first_name: row.tweeting_first_name,
              last_name: row.tweeting_last_name,
            },
            retweeted_from: retweet,
          },
        };
      });
      const data = {
        user: {
          user_id: req.params.user_id,
          username: rows[0].username,
          first_name: rows[0].first_name,
          last_name: rows[0].last_name,
        },
        likes,
      };
      return res.json({
        errors: [],
        data,
      });
    })
    .catch(function () {
      return res
        .status(400)
        .json({
          errors: ['an error occured fetching likes'],
          data: {},
        });
    });
};
