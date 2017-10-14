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

  config.DB('follows')
    .where('is_following', req.params.user_id)
    .join('users', 'follows.is_following', 'users.id')
    .select(
      'follows.id',
      'follows.is_following',
      'follows.created_at',
      'users.username',
      'users.first_name',
      'users.last_name',
    )
    .then(function (rows) {
      const followers = rows.map(row => ({
        id: row.id,
        created_at: row.created_at,
        username: row.username,
        first_name: row.first_name,
        last_name: row.last_name,
      }));
      const data = {
        user: {
          id: req.params.user_id,
        },
        followers,
      };
      return res.json({
        errors: [],
        data,
      });
    })
    .catch(function () {
      return res.json({
        errors: ['an error occured fetching followers'],
        data: {},
      });
    });
};
