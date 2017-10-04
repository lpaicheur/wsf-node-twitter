require('dotenv').config();

module.exports = {
  PORT: 3000,
  DB: require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  }),
};
