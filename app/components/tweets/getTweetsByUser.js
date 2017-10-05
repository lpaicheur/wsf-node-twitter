const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`); // eslint-disable-line import/no-dynamic-require

module.exports = (req, res) => {
  if (!req.params.user_id || typeof req.params.user_id !== 'string') {
    res.json({
      errors: ['user_id is not valid'],
      data: {},
    });
  }

  config.DB('tweets')
    .join('users', 'tweets.user_id', 'users.id')
    .select('tweets.id', 'tweets.message', 'tweets.retweeted_from', 'tweets.created_at', 'users.first_name', 'users.last_name').where({
      'tweets.user_id': req.params.user_id,
      'tweets.deleted_at': null,
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
