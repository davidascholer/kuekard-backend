const winston = require('winston');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function() {
  try {
    mongoose.connect(process.env.DB_CONNECTION_STRING,{ useNewUrlParser: true , useUnifiedTopology: true } )
      .then(() => winston.info('Connected to MongoDB...'));
  } catch (error) {
      throw new Error(error);
  }
}