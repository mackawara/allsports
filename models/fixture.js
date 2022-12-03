const mongoose = require("mongoose");

const fixtureSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  home: {
    type: String,
    required: true,
  },
  away: {
    type: String,
    required: true,
  },
  competition: {
    type: String,
    required: true,
  },

  matchStatus: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  fixtureID: {
    type: String,
    required: true,
  },
});

const fixtureModel = mongoose.model("fixture", fixtureSchema);

module.exports=fixtureModel
