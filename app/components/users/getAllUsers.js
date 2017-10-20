/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);

module.exports = (req, res) => {
  config.DB('users')
    .select('id as user_id', 'username', 'first_name', 'last_name')
    .orderBy('created_at', 'desc')
    .where({
      deleted_at: null,
    })
    .then(function (rows) {
      return res.json({
        errors: [],
        data: rows,
      });
    })
    .catch(function () {
      return res
        .status(400)
        .json({
          errors: ['an error occured fetching users'],
          data: {},
        });
    });
};
