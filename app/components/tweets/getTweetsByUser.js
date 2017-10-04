const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`); // eslint-disable-line import/no-dynamic-require

module.exports = (req, res) => {
  config.DB('tweets').select('id', 'message', 'retweeted_from', 'user_id', 'created_at').where({
    user_id: req.params.user_id,
    deleted_at: null,
  })
    .then(rows => res.json({
      errors: [],
      data: rows,
    }))
    .catch(err => res.json({
      errors: ['an error occured fetching data'],
      data: {},
    }));
};
