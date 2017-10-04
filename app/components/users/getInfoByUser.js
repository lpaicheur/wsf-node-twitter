const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`); // eslint-disable-line import/no-dynamic-require

module.exports = (req, res) => {
  if (!req.params.id || typeof req.params.id !== 'string') {
    res.json({
      errors: ['user_id is not valid'],
      data: {},
    });
  }

  config.DB('users').select('username', 'email', 'first_name', 'last_name', 'created_at').where('id', req.params.id)
    .then(users => res.json({
      errors: [],
      data: users,
    }))
    .catch(() => res.json({
      errors: ['error while getting user info'],
      data: {},
    }));
};