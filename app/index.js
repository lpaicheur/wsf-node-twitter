const express = require('express');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`./config/${env}`);

const app = express();

app.use(bodyParser.json());

/* eslint-disable global-require */
const middlewares = {
  auth: require('./middlewars/auth.js'),
};

const services = {
  users: {
    addUser: require('./components/users/addUser'),
    getAllUsers: require('./components/users/getAllUsers'),
    getInfoByUser: require('./components/users/getInfoByUser'),
    updateUser: require('./components/users/updateUser'),
  },
  tweets: {
    addTweet: require('./components/tweets/addTweet'),
    getTweetsByUser: require('./components/tweets/getTweetsByUser'),
  },
  likes: {
    likeATweet: require('./components/likes/likeATweet'),
    unlikeATweet: require('./components/likes/unlikeATweet'),
    getLikesByUser: require('./components/likes/getLikesByUser'),
  },
  follows: {
    getFollowingsByUser: require('./components/follows/getFollowingsByUser'),
    getFollowersByUser: require('./components/follows/getFollowersByUser'),
  },
};
/* eslint-enable global-require */

app.get('/', (req, res) => {
  res.send('Welcome to twitter');
});

// Get all users
app.get('/users', services.users.getAllUsers);

// Add a new user
app.post('/users', services.users.addUser);

// Get user's infos
app.get('/users/:user_id/info', services.users.getInfoByUser);

// Update user's infos
app.put('/users/:user_id/info', middlewares.auth, services.users.updateUser);

// Get user's tweets
app.get('/users/:user_id/tweets', services.tweets.getTweetsByUser);

// Add a new tweet
app.post('/users/:user_id/tweets', services.tweets.addTweet);

// Get user's likes
app.get('/users/:user_id/likes', services.likes.getLikesByUser);

// Get the people following a user
app.get('/users/:user_id/followers', services.follows.getFollowersByUser);

// Get the people a user follows
app.get('/users/:user_id/followings', services.follows.getFollowingsByUser);

// Like a tweet
app.get('/tweets/:tweet_id/like', middlewares.auth, services.likes.likeATweet);

// Unlikes a tweet
app.get('/tweets/:tweet_id/unlike', middlewares.auth, services.likes.unlikeATweet);

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${config.PORT}!`);
});

// Export for testing
module.exports = app;
