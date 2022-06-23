const auth = require('../middleware/auth');
const winston = require('winston');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate: validateUser } = require('../models/user');
const { FacebookUser, validate: validateFacebookUser } = require('../models/facebookuser');
const { GoogleUser, validate: validateGoogleUser } = require('../models/googleuser');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  let user = await User.findById(req.user._id).select('-password');
  if (!user)
    user = await GoogleUser.findById(req.user._id);
  if (!user)
    user = await FacebookUser.findById(req.user._id);
  res.send(JSON.stringify(user));
});

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(JSON.stringify(error.details[0].message));

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(JSON.stringify('User already registered.'));

  //shorthand for {'name' : req.body.name, ...}
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  user.token = user.generateAuthToken();
  res.send(JSON.stringify(_.pick(user, ['token'])));
  // res.send(JSON.stringify(_.pick(user, ['_id', 'name', 'email','token'])));
});

router.post('/facebook', async (req, res) => {

  const { error } = validateFacebookUser(req.body);
  if (error) return res.status(400).send(JSON.stringify(error.details[0].message));

  let facebookUser = await FacebookUser.findOne({ email: req.body.email });
  if (!facebookUser) {
    facebookUser = new FacebookUser(_.pick(req.body, ['name', 'email', 'pictureURL']));
    await facebookUser.save();
  }

  facebookUser.token = facebookUser.generateAuthToken();
  res.send(JSON.stringify(_.pick(facebookUser, ['token'])));
});

router.post('/google', async (req, res) => {

  const { error } = validateGoogleUser(req.body);
  if (error) return res.status(400).send(JSON.stringify(error.details[0].message));

  let googleUser = await GoogleUser.findOne({ email: req.body.email });
  if (!googleUser) {
    googleUser = new GoogleUser(_.pick(req.body, ['name', 'email', 'pictureURL']));
    await googleUser.save();
  }

  googleUser.token = googleUser.generateAuthToken();
  res.send(JSON.stringify(_.pick(googleUser, ['token'])));
});

module.exports = router;
