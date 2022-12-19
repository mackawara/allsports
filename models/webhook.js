const mongoose = require("mongoose");

const messageIdSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  

  messageId: {
    type: String,
    required: true,
  }
});

const MessageIdModel = mongoose.model("messageId", messageIdSchema);

module.exports = MessageIdModel;
