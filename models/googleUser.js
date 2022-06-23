const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const googleUserSchema = new mongoose.Schema({
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

googleUserSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
}

const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

function validateUser(googleUser) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    pictureURL: Joi.string().min(5).max(512).required()
  };

  return Joi.validate(googleUser, schema);
}

exports.GoogleUser = GoogleUser; 
exports.validate = validateUser;