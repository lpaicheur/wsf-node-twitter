require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  DB: require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  }),
};
