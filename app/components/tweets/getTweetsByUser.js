/* eslint-disable import/no-dynamic-require, prefer-arrow-callback, func-names */
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`);

module.exports = (req, res) => {
  if (!req.params.user_id || typeof req.params.user_id !== 'string') {
    res.json({
      errors: ['user_id is not valid'],
      data: {},
    });
  }

  config.DB('tweets')
    .select('id', 'message', 'retweeted_from', 'created_at')
    .where({
      user_id: req.params.user_id,
      deleted_at: null,
    })
    .then(function (rows) {
      return res.json({
        errors: [],
        data: rows,
      });
    })
    .catch(function () {
      return res.json({
        errors: ['an error occured fetching data'],
        data: {},
      });
    });
};
