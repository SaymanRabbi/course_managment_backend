
const mongoose = require("mongoose");

const Notification = new mongoose.Schema(
    {
        message: {
        type: String,
        required: [true, "Please enter your message"],
        },
        individual: {
        type: Boolean,
        default: false,
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

module.exports = mongoose.model("Notification", Notification);