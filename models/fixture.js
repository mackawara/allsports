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
  goals: {
    type: String,
    required: true,
  },
  matchStatus: {
    type: String,
    required: true,
  },
  scores: {
    type: String,
    required: true,
  },
  fixtureId: {
    type: String,
    required: true,
  },
});

const fixtureModel = mongoose.model("fixture", fixtureSchema);

module.exports=fixtureModel
/* const saveFixture=async((req,res,next)=>{
const fixture=new fixtureModel({

})
}) */