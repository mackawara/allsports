const mongoose = require("mongoose");

const clientNumberSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  number:{
    type:String,
    required:true,

  }
});

const clientNumberModel = mongoose.model("clientNumber", clientNumberSchema);

module.exports=clientNumberModel
