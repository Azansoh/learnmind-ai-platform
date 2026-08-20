import Course from "../models/course.js";
import Enrollment from "../models/enrollment.js";
import User from "../models/user.js";
import Activity from "../models/activity.js";

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().select("-lessons");
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate("course");
    const courses = enrollments.map((e) => ({
      ...e.course.toObject(),
      progress: e.progress,
      enrollmentId: e._id,
      completedLessons: e.completedLessons.length,
    }));
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const exists = await Enrollment.findOne({ user: req.user._id, course: courseId });
    if (exists) {
      return res.json(exists);
    }

    const enrollment = await Enrollment.create({ user: req.user._id, course: courseId });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: courseId },
    });

    await Activity.create({
      user: req.user._id,
      type: "course_enroll",
      description: `Enrolled in ${course.title}`,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

export const unenrollFromCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOneAndDelete({ user: req.user._id, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in this course" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledCourses: courseId },
    });

    await Activity.create({
      user: req.user._id,
      type: "course_enroll",
      description: `Unenrolled from a course`,
      course: courseId,
    });

    res.json({ message: "Successfully unenrolled" });
  } catch (error) {
    next(error);
  }
};

export const getLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    const isCompleted = enrollment
      ? enrollment.completedLessons.some((id) => id.toString() === lesson._id.toString())
      : false;

    const lessonIndex = course.lessons.findIndex(
      (l) => l._id.toString() === lesson._id.toString()
    );

    res.json({
      lesson: lesson.toObject(),
      isCompleted,
      totalLessons: course.lessons.length,
      lessonIndex,
      courseTitle: course.title,
      courseId: course._id,
    });
  } catch (error) {
    next(error);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });

    if (!enrollment) {
      enrollment = await Enrollment.create({ user: req.user._id, course: courseId });
    }

    const alreadyCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push(lessonId);
      const totalLessons = course.lessons.length;
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );
      enrollment.lastAccessedLesson = lessonId;
      await enrollment.save();

      const lesson = course.lessons.id(lessonId);
      await Activity.create({
        user: req.user._id,
        type: "lesson_complete",
        description: `Completed "${lesson?.title || "lesson"}" in ${course.title}`,
        course: courseId,
      });
    }

    res.json({
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons.length,
      totalLessons: course.lessons.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate("course");

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.progress === 100).length;
    const totalLessonsCompleted = enrollments.reduce(
      (sum, e) => sum + e.completedLessons.length, 0
    );
    const averageProgress =
      totalCourses > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
        : 0;

    res.json({
      totalCourses,
      completedCourses,
      totalLessonsCompleted,
      averageProgress,
      enrollments: enrollments.map((e) => ({
        course: e.course,
        progress: e.progress,
        completedLessons: e.completedLessons.length,
        totalLessons: e.course?.totalLessons || 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};
