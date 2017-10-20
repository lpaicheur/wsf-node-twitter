/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);

module.exports = (req, res) => {
  config.DB('tokens')
    .select('id', 'api_key', 'api_token', 'is_enabled')
    .where({
      user_id: req.user_id,
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
          errors: ['an error occured fetching tokens'],
          data: {},
        });
    });
};
