const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`); // eslint-disable-line import/no-dynamic-require

module.exports = (req, res) => {
  if (!req.params.id || typeof req.params.id !== 'string') {
    res.json({
      errors: ['user_id is not valid'],
      data: {},
    });
  }

  config.DB('tweets').select('id', 'message', 'retweeted_from', 'user_id', 'created_at').where({
    user_id: req.params.user_id,
    deleted_at: null,
  })
    .then(rows => res.json({
      errors: [],
      data: rows,
    }))
    .catch(() => res.json({
      errors: ['an error occured fetching data'],
      data: {},
    }));
};
