/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

module.exports = (req, res, next) => {
  // Validation pour headers
  if (!req.header('X-API-Key') || !req.header('X-API-Token')) {
    return res
      .status(401)
      .json({
        errors: ['error authentificating'],
        data: {},
      });
  }

  config.DB('tokens')
    .select('user_id')
    .where({
      api_key: req.header('X-API-Key'),
      api_token: req.header('X-API-Token'),
      is_enabled: true,
      deleted_at: null,
    })
    .then(function (rows) {
      if (!rows.length) {
        return res
          .status(401)
          .json({
            errors: ['error authentificating'],
            data: {},
          });
      }
      req.user_id = rows[0].user_id;
      return next();
    })
    .catch(function () {
      return res
        .status(400)
        .json({
          errors: ['error authentificating'],
          data: {},
        });
    });
};
