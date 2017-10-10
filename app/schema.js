const Joi = require('joi');

const idSchema = Joi.string();

exports.id = value => Joi.validate(value, idSchema);
