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
    lastname: {
      type: String,
      trim: true,
      maxlength: [30, "Your name cannot exceed 30 characters"],
    },
    UserName: {
      type: String,
      trim: true,
      maxlength: [10, "Your username cannot exceed 10 characters"],
    },
    PhoneNumber: {
      type: Number,
      trim: true,
      maxlength: [11, "Your phone number cannot exceed 10 characters"],
    },
    ProfileImage: {
      type: String,
      default: "",
    },
    ExpartIn: {
      type: String,
      trim: true,
      maxlength: [10, "Your ExpartIn cannot exceed 50 characters"],
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
        submitAnswerobg: { type: Object },
        title: { type: String },
        quizLength: { type: Number },
      },
    ],
    assignment: [],
    courseProgress: [
      {
        courseId: { type: String },
        title: { type: String },
      },
    ],
    seeTotalVideo: {
      type: Number,
      default: 0,
    },
    prfileProgress: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["student", "super-admin", "admin"],
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
    Biography: {
      type: String,
      trim: true,
      maxlength: [500, "Your Biography cannot exceed 500 characters"],
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [30, "Your name cannot exceed 30 characters"],
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
