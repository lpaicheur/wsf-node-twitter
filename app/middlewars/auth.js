/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);
// const schema = require('../schema');

module.exports = (req, res, next) => {
  // Validation pour headers
  // - X-API-Key
  // - X-API-Token

  // Si pas présent return error
  // Si présent verifier qu'ils sont corrects dans la DB

  // if(!req.header(''))

  /*
  .where({
    api_key:
    api_token:
    is_enabled: true
    deleted_at: null
  })
  .then(function(rows) { Comment ça req.users_id est disponible partout
    req.user_id = rows[0].id
  })
  */

  if (!req.header('X-API-Key') || !req.header('X-API-Token')) {
    return res.json({
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
