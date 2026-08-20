import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  content: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  duration: { type: String, default: "0 min" },
  order: { type: Number, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail: { type: String, default: "" },
    instructor: { type: String, required: true },
    duration: { type: String, default: "0h 0m" },
    totalLessons: { type: Number, default: 0 },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
