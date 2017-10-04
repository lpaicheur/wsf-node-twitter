const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}`); // eslint-disable-line import/no-dynamic-require

module.exports = (req, res) => {
  config.DB('users').select('username', 'email', 'first_name', 'last_name', 'created_at')
    .then(rows => res.json({
      errors: [],
      data: rows,
    }))
    .catch(() => res.json({
      errors: ['an error occured fetching data'],
      data: {},
    }));
};