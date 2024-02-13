const mongoose = require("mongoose");

const QuizOptionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  answer: { type: Boolean, required: true },
});

const QuizQuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  options: [QuizOptionSchema],
});

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String },
    url: { type: String },
    isWatched: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["video", "assignment", "quiz"],
      default: "video",
    },
    assignmentDetails: {
      deadline: { type: Date },
      instructions: { type: String },
    },
    quizDetails: {
      title: { type: String },
      questions: [QuizQuestionSchema],
    },
  },
  { _id: false }
);

const ModuleSchema = new mongoose.Schema({
  title: { type: String },
  lessons: [LessonSchema],
});

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter your title"],
      trim: true,
      maxlength: [100, "Your title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please enter your description"],
      trim: true,
      maxlength: [500, "Your description cannot exceed 500 characters"],
    },
    teacherID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    purchessUserId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    modules: [ModuleSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", CourseSchema);
