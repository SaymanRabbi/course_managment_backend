const mongoose = require("mongoose");

const ChangesPass = new mongoose.Schema(
  {
    Passcode: {
      type: Number,
      required: [true, "Please enter your Passcode"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ChangesPass", ChangesPass);
