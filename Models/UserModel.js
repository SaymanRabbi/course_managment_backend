const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxlength: [30, "Your name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      trim: true,
    },
    courses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        progress: { type: Number, default: 0 },
      },
    ],
    quizs: [
      {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
        score: { type: Number, default: 0 },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      },
    ],
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    activeDevice: [
      {
        type: String,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
User.pre("save", async function (next) {
  const user = this;
  // if user password is not modified then return next
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("User", User);
