const mongoose = require("mongoose");

const Assignment = new mongoose.Schema(
    {
        AssignmentName: {
        type: String,
        required: [true, "Please enter Assignment Name"],
        },
        AssignmentDescription: {
        type: String,
        required: [true, "Please enter Assignment Description"],
        },
        AssignmentFile: {
        type: String,
        required: [true, "Please enter Assignment File"],
        },
        AssignmentDeadline: {
        type: Date,
        required: [true, "Please enter Assignment Deadline"],
        },
        AssignmentMarks: {
        type: Number,
        required: [true, "Please enter Assignment Marks"],
        },
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please enter User Id"],
        ref: "User",
        },
        moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please enter Module Id"],
        },
        adminSeen:{
        type: Boolean,
        default: false,
        },
        
    },
    {
        timestamps: true,
    }
    )
module.exports = mongoose.model("Assignment", Assignment)