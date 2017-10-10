const Joi = require('joi');

const idSchema = Joi.string().required();

exports.id = value => Joi.validate(value, idSchema);

const userSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  first_name: Joi.string().alphanum().required(),
  last_name: Joi.string().alphanum().required(),
});

exports.user = value => Joi.validate(value, userSchema);

const tweetSchema = Joi.string().min(1).max(140).required();

exports.tweet = value => Joi.validate(value, tweetSchema);
