const express = require('express');
const cors = require('cors');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

const corsOptions = {
  origin: 'http://localhost:3000'
}

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', cors(corsOptions), users);
  app.use('/api/auth', cors(corsOptions), auth);
  app.use(error);
}