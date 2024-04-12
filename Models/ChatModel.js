const mongoose = require("mongoose");

const Chat = mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", Chat);
