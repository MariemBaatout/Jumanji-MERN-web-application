const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  
  token: {
    type: String,
    required: true
  }
});
const Token =  mongoose.model('Token', tokenSchema , 'token');

module.exports = Token ;