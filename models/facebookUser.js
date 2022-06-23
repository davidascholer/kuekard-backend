const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const facebookUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  pictureURL: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 512
  }
});

facebookUserSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
}

const FacebookUser = mongoose.model('FacebookUser', facebookUserSchema);

function validateUser(facebookUser) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    pictureURL: Joi.string().min(5).max(512).required()
  };

  return Joi.validate(facebookUser, schema);
}

exports.FacebookUser = FacebookUser; 
exports.validate = validateUser;