module.exports = {
  PORT: 3000,
  DB: require('knex')({
    client: 'pg',
    connection: 'postgres://rdmfcewpwarisj:214f4d057f99c0c35b671a7c4c61d0041b17d8a677547b21c7368a3b3b63cfb0@ec2-54-75-228-125.eu-west-1.compute.amazonaws.com:5432/da0fsedudip1ah?ssl=true',
  }),
};
