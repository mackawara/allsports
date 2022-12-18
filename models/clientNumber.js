const mongoose = require("mongoose");

const clientNumberSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  optedIn: {
    type: Boolean,
    required: true,
  },
  phone_number_id: {
    type: String,
    required: true,
  },
  preference:{
    type:String,
    required:true
  }
});

const clientNumberModel = mongoose.model("clientNumber", clientNumberSchema);

module.exports = clientNumberModel;
