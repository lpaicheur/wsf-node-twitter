const express = require('express');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`./config/${env}`);

const app = express();

app.use(bodyParser.json());

/* eslint-disable global-require */
const services = {
  users: {
    addUser: require('./components/users/addUser'),
    getAllUsers: require('./components/users/getAllUsers'),
    getInfoByUser: require('./components/users/getInfoByUser'),
    getFollowingsByUser: require('./components/users/getFollowingsByUser'),
    getFollowersByUser: require('./components/users/getFollowersByUser'),
    getLikesByUser: require('./components/users/getLikesByUser'),
    updateUser: require('./components/users/updateUser'),
  },
  tweets: {
    addTweet: require('./components/tweets/addTweet'),
    getTweetsByUser: require('./components/tweets/getTweetsByUser'),
  },
};
/* eslint-enable global-require */

app.get('/', (req, res) => {
  res.send('Welcome to twitter');
});

app.get('/users', services.users.getAllUsers);

app.post('/users', services.users.addUser);

app.get('/users/:user_id/info', services.users.getInfoByUser);

app.put('/users/:user_id/info', services.users.updateUser);

app.get('/users/:user_id/tweets', services.tweets.getTweetsByUser);

app.post('/users/:user_id/tweets', services.tweets.addTweet);

app.get('/users/:user_id/likes', services.users.getLikesByUser);

app.get('/users/:user_id/followers', services.users.getFollowersByUser);

app.get('/users/:user_id/followings', services.users.getFollowingsByUser);

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${config.PORT}!`);
});
