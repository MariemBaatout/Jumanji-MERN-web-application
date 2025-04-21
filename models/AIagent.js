const mongoose = require('mongoose');

const AIagentSchema = new mongoose.Schema({
  speciesName: String,
  location: String,
  endangered: Boolean,
});

const AIagent = mongoose.model('AIagent', AIagentSchema);

module.exports = AIagent;
