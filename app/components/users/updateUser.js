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

  if (schema.user(req.body).error) {
    return res.json({
      errors: ['user is not valid'],
      data: {},
    });
  }

  const { username, email, first_name, last_name } = req.body;

  config.DB('users')
    .where('id', req.params.user_id)
    .update({
      username,
      email,
      first_name,
      last_name,
    })
    .then(function () {
      return res
        .status(201)
        .json({
          errors: [],
          data: {
            id: req.params.user_id,
            username,
            email,
            first_name,
            last_name,
          },
        });
    })
    .catch(function () {
      return res.json({
        errors: ['error updating user'],
        data: {},
      });
    });
};
