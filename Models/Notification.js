
const mongoose = require("mongoose");

const Notification = new mongoose.Schema(
    {
        message: {
        type: String,
        required: [true, "Please enter your message"],
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Notification", Notification);