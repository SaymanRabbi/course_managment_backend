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
    price: {
      type: Number,
      required: [true, "Please enter your price"],
    },
    reviews: [
      {
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    image: {
      type: String,
      required: [true, "Please enter your image"],
    },
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
    deadline: { type: Date },
    startDate: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: false },
  }
);
// Virtual field to check if the course is active
CourseSchema.virtual("isActive").get(function () {
  const currentDate = new Date();
  // Check if the current date is before the deadline and after the start date
  return (
    !this.deadline ||
    (this.startDate <= currentDate && currentDate <= this.deadline)
  );
});

// Apply getters to include virtual fields when converting to JSON or Object
CourseSchema.set("toObject", { getters: true });
CourseSchema.set("toJSON", { getters: true });
module.exports = mongoose.model("Course", CourseSchema);
