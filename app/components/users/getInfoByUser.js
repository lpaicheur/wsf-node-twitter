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

  config.DB('users').select('username', 'email', 'first_name', 'last_name', 'created_at').where('id', req.params.user_id)
    .then(users => res.json({
      errors: [],
      data: users,
    }))
    .catch(() => res.json({
      errors: ['error while getting user info'],
      data: {},
    }));
};
