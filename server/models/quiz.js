import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: "" },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    questions: [questionSchema],
    timeLimit: { type: Number, default: 300 },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
