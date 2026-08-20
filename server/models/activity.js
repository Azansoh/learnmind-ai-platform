import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["lesson_complete", "quiz_complete", "course_enroll", "ai_chat", "study_task"],
      required: true,
    },
    description: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
