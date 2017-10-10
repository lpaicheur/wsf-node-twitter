const Joi = require('joi');

const idSchema = Joi.string();

exports.id = value => Joi.validate(value, idSchema);

const userSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  first_name: Joi.string().empty().required(),
  last_name: Joi.string().empty().required(),
});

exports.user = value => Joi.validate(value, userSchema);
