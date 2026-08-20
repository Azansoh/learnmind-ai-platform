import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaPlayCircle,
  FaSpinner,
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/authcontext";
import { useToast } from "../context/toastcontext";

function Lesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [lessonData, setLessonData] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const [lessonRes, courseRes] = await Promise.all([
          api.get(`/courses/${courseId}/lesson/${lessonId}`),
          api.get(`/courses/${courseId}`),
        ]);
        setLessonData(lessonRes.data);
        setCourse(courseRes.data);
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        toast.error("Failed to load lesson. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, lessonId]);

  const handleComplete = async () => {
    try {
      setCompleting(true);
      await api.post(`/courses/${courseId}/lesson/${lessonId}/complete`);
      toast.success("Lesson marked as complete! Great job!");
      const res = await api.get(`/courses/${courseId}/lesson/${lessonId}`);
      setLessonData(res.data);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to mark as complete.";
      toast.error(msg);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium text-sm">
            Loading lesson...
          </p>
        </div>
      </div>
    );
  }

  if (!lessonData || !course) {
    return (
      <div className="text-center py-20 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-lg backdrop-blur-sm">
        <div className="w-20 h-20 bg-slate-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaBookOpen className="text-3xl text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">
          Lesson not found
        </h3>
        <p className="text-slate-400 text-sm mt-1 mb-6">
          The lesson you are looking for does not exist.
        </p>
        <Link
          to={`/course/${courseId}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-500/20"
        >
          <FaArrowLeft className="text-xs" />
          Back to Course
        </Link>
      </div>
    );
  }

  const { lesson, isCompleted, totalLessons, lessonIndex, courseTitle } = lessonData;
  const lessons = course.lessons || [];
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < totalLessons - 1 ? lessons[lessonIndex + 1] : null;

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to={`/course/${courseId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          Back to Course
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
        <Link to="/my-courses" className="hover:text-indigo-400 transition-colors">
          My Courses
        </Link>
        <span className="text-slate-600">/</span>
        <Link
          to={`/course/${courseId}`}
          className="hover:text-indigo-400 transition-colors truncate max-w-[150px] sm:max-w-none"
        >
          {courseTitle}
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200 font-semibold truncate max-w-[150px] sm:max-w-none">
          {lesson.title}
        </span>
      </div>

      {/* Lesson Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {lesson.title}
        </h1>
        <div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full backdrop-blur-md">
              <FaCheckCircle className="text-xs" />
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold rounded-full backdrop-blur-md">
              <FaClock className="text-xs" />
              {lesson.duration || "In Progress"}
            </span>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg overflow-hidden backdrop-blur-sm">
        {lesson.videoUrl ? (
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={getYouTubeEmbedUrl(lesson.videoUrl)}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40">
            <div className="w-16 h-16 bg-slate-800/60 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
              <FaBookOpen className="text-3xl text-slate-500" />
            </div>
            <p className="text-slate-300 font-semibold">No video available</p>
            <p className="text-xs text-slate-500 mt-1">
              This lesson does not have an attached video tutorial.
            </p>
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-4">Lesson Overview</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
          {lesson.content || "No detailed content provided for this lesson."}
        </p>
        {lesson.duration && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-400">
            <FaClock className="text-slate-500" />
            Estimated Time: {lesson.duration}
          </div>
        )}
      </div>

      {/* Mark as Complete Action */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-sm p-6">
        {isCompleted ? (
          <div className="flex items-center gap-3 text-emerald-400">
            <FaCheckCircle className="text-xl shrink-0" />
            <span className="font-semibold text-sm sm:text-base">
              You have completed this lesson!
            </span>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {completing ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                Marking...
              </>
            ) : (
              <>
                <FaCheckCircle className="text-sm" />
                Mark as Complete
              </>
            )}
          </button>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {prevLesson ? (
          <Link
            to={`/course/${courseId}/lesson/${prevLesson._id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
          >
            <FaArrowLeft className="text-xs" />
            Previous Lesson
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            to={`/course/${courseId}/lesson/${nextLesson._id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
          >
            Next Lesson
            <FaArrowRight className="text-xs" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default Lesson;