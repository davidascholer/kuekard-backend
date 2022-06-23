const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(JSON.stringify(error.details[0].message));

  //invalid email
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(JSON.stringify('Invalid email or password.'));

  //invalid password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send(JSON.stringify('Invalid email or password.'));

  user.token = user.generateAuthToken();
  res.send(JSON.stringify(_.pick(user, ['token'])));
  // res.send(JSON.stringify(_.pick(user, ['_id', 'name', 'email','token'])));
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
