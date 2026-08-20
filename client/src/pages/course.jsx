import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaPlayCircle,
  FaClock,
  FaBookOpen,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/toastcontext";
import ConfirmModal from "../components/confirmmodal";

function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unenrolling, setUnenrolling] = useState(false);
  const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data);

      try {
        const enrolledRes = await api.get("/courses/my-courses");
        const found = enrolledRes.data.find((e) => e._id === id);
        setEnrollment(found || null);
        if (found && found.completedLessons >= 0) {
          setCompletedLessonIds(Array.isArray(found.completedLessons) ? found.completedLessons : []);
        }
      } catch {
        setEnrollment(null);
      }
    } catch (err) {
      toast.error("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success("Successfully enrolled in the course!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll.");
    }
  };

  const handleUnenroll = async () => {
    setUnenrolling(true);
    try {
      await api.delete(`/courses/${id}/unenroll`);
      toast.success("You have been unenrolled from this course.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to unenroll.");
    } finally {
      setUnenrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium text-sm">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-lg">
        <div className="w-20 h-20 bg-slate-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaBookOpen className="text-3xl text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">
          Course not found
        </h3>
        <p className="text-slate-400 mt-1 mb-6 text-sm">
          The course you are looking for does not exist.
        </p>
        <Link
          to="/my-courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition border border-slate-700"
        >
          <FaArrowLeft className="text-sm" />
          Back to My Courses
        </Link>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const completedCount = enrollment ? (enrollment.completedLessons || 0) : 0;
  const totalLessons = lessons.length;
  const progress = enrollment ? (enrollment.progress || 0) : 0;

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/my-courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-indigo-400"
        >
          <FaArrowLeft className="text-xs" />
          Back to My Courses
        </Link>
      </div>

      {/* Course Header Card */}
      <div className="overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-sm">
        {/* Gradient Banner */}
        <div
          className={`relative bg-gradient-to-r ${
            course.gradient || "from-indigo-600 to-violet-700"
          } p-8 md:p-10 text-white`}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-inner">
              <FaBookOpen size={30} />
            </div>
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-slate-950/60 border border-white/20 backdrop-blur-md mb-4 capitalize">
              {course.level}
            </span>
            <h1 className="mb-3 text-3xl font-extrabold md:text-4xl tracking-tight">
              {course.title}
            </h1>
            <p className="max-w-3xl leading-7 text-slate-200 text-sm md:text-base">
              {course.description}
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-300 font-medium">
              <FaUser className="text-sm text-indigo-200" />
              <span>Instructor: {course.instructor}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4 bg-slate-900/60">
          <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Progress
            </p>
            <p className="mt-1 text-2xl font-extrabold text-indigo-400">
              {progress}%
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Lessons
            </p>
            <p className="mt-1 text-2xl font-extrabold text-white">
              {totalLessons}
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completed
            </p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-400">
              {completedCount}
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Duration
            </p>
            <p className="mt-1 text-2xl font-extrabold text-white">
              {course.duration}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      {enrollment && (
        <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800/80 shadow-lg backdrop-blur-sm">
          <div className="mb-3 flex justify-between items-center">
            <h2 className="font-bold text-white">Your Course Progress</h2>
            <span className="font-bold text-indigo-400">{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            {completedCount} of {totalLessons} lessons completed
          </p>
        </div>
      )}

      {/* Enroll Banner if not enrolled */}
      {!enrollment && (
        <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800/80 shadow-lg backdrop-blur-sm text-center">
          <p className="text-slate-400 mb-4 text-sm font-medium">
            You are not enrolled in this course yet.
          </p>
          <button
            onClick={handleEnroll}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-6 py-3 font-semibold text-white transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
          >
            <FaBookOpen className="text-sm" />
            Enroll in Course
          </button>
        </div>
      )}

      {/* Unenroll Button if enrolled */}
      {enrollment && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowUnenrollConfirm(true)}
            disabled={unenrolling}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition disabled:opacity-50"
          >
            <FaTimes className="text-xs" />
            {unenrolling ? "Unenrolling..." : "Unenroll from Course"}
          </button>
        </div>
      )}

      {/* Lessons List */}
      <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800/80 shadow-lg backdrop-blur-sm">
        <h2 className="mb-6 text-xl font-bold text-white">Course Lessons</h2>

        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessonIds.includes(lesson._id);

            return (
              <div
                key={lesson._id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-4 gap-4 transition-all duration-200 ${
                  isCompleted
                    ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
                    : "border-slate-800 bg-slate-800/30 hover:border-slate-700 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Lesson Number / Status Badge */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheckCircle className="text-lg" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-white">{lesson.title}</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  {/* Duration */}
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <FaClock className="text-xs text-slate-500" />
                    {lesson.duration}
                  </span>

                  {/* Status Action Link */}
                  <Link to={`/course/${id}/lesson/${lesson._id}`}>
                    {isCompleted ? (
                      <span className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5">
                        <FaCheckCircle className="text-xs" />
                        Completed
                      </span>
                    ) : (
                      <span className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm">
                        <FaPlayCircle className="text-xs" />
                        Start
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmModal
        isOpen={showUnenrollConfirm}
        onClose={() => setShowUnenrollConfirm(false)}
        onConfirm={handleUnenroll}
        title="Unenroll from Course"
        message="Are you sure you want to unenroll? You will lose access to all lessons and your progress will be deleted."
        confirmText="Yes, Unenroll"
        danger
      />
    </div>
  );
}

export default Course;