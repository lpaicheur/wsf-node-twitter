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
    .select(
      'users.username',
      'users.first_name',
      'users.last_name',
      'tweets.id', 'tweets.message',
      'tweets.retweeted_from',
      'tweets.created_at',
      'retweets.message as retweets_message',
      'retweets.created_at as retweets_created_at',
      'retweets.user_id as retweets_user_id',
      'tweeting.username as tweeting_username',
      'tweeting.first_name as tweeting_first_name',
      'tweeting.last_name as tweeting_last_name',
    )
    .leftJoin('users', 'tweets.user_id', 'users.id')
    .leftJoin('tweets as retweets', 'tweets.retweeted_from', 'retweets.id')
    .leftJoin('users as tweeting', 'retweets.user_id', 'tweeting.id')
    .where({
      'tweets.user_id': req.params.user_id,
      'tweets.deleted_at': null,
    })
    .then(function (rows) {
      const tweets = rows.map((row) => {
        let retweet = null;
        if (row.retweeted_from) {
          retweet = {
            tweet_id: row.retweeted_from,
            message: row.retweets_message,
            created_at: row.retweets_created_at,
            user: {
              user_id: row.retweets_user_id,
              username: row.tweeting_username,
              first_name: row.tweeting_first_name,
              last_name: row.tweeting_last_name,
            },
          };
        }
        return {
          tweet_id: row.id,
          message: row.message,
          created_at: row.created_at,
          retweeted_from: retweet,
        };
      });
      const data = {
        user: {
          user_id: req.params.user_id,
          username: rows[0].username,
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
      return res
        .status(400)
        .json({
          errors: ['an error occured fetching data'],
          data: {},
        });
    });
};
