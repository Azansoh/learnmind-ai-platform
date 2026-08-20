import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: null,
  },
  date: { type: Date, required: true },
  duration: { type: Number, default: 30 },
  completed: { type: Boolean, default: false },
});

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: { type: String, required: true },
    dailyMinutes: { type: Number, default: 60 },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

export default mongoose.model("StudyPlan", studyPlanSchema);
