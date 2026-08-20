import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        selectedAnswer: Number,
        isCorrect: Boolean,
      },
    ],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("QuizResult", quizResultSchema);
