/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);
const schema = require('../../schema');

module.exports = (req, res) => {
  if (schema.id(req.params.follow_user_id).error) {
    return res.json({
      errors: ['follow_user_id is not valid'],
      data: {},
    });
  }

  const { follow_user_id } = req.params;

  config.DB('follows')
    .where({
      user_id: req.user_id,
      is_following: follow_user_id,
    })
    .update({
      updated_at: config.DB.raw('CURRENT_TIMESTAMP'),
      deleted_at: config.DB.raw('CURRENT_TIMESTAMP'),
    })
    .then(function () {
      return res.status(201).json({
        errors: [],
        data: { user_id: req.user_id, follow_user_id },
      });
    })
    .catch(function () {
      return res.json({
        errors: ['error inserting like'],
        data: {},
      });
    });
};
