import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaArrowUp,
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/authcontext";

function Progress() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [progressRes, quizRes] = await Promise.all([
          api.get("/courses/progress"),
          api.get("/quizzes/my-results"),
        ]);
        setProgressData(progressRes.data);
        setQuizResults(Array.isArray(quizRes.data) ? quizRes.data : []);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen bg-[#060913]">
        <FaSpinner className="animate-spin text-3xl text-indigo-500" />
      </div>
    );
  }

  const totalCourses = progressData?.totalCourses || 0;
  const completedCourses = progressData?.completedCourses || 0;
  const lessonsCompleted = progressData?.lessonsCompleted || 0;
  const averageProgress = progressData?.averageProgress || 0;
  const enrollments = progressData?.enrollments || [];

  const stats = [
    {
      label: "TOTAL COURSES",
      value: totalCourses,
      icon: FaBookOpen,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "COMPLETED COURSES",
      value: completedCourses,
      icon: FaCheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "LESSONS COMPLETED",
      value: lessonsCompleted,
      icon: FaClock,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "AVERAGE PROGRESS",
      value: `${averageProgress}%`,
      icon: FaChartLine,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060913] p-4 sm:p-6 lg:p-8 text-slate-200">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-sm">
            <FaChartLine className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Progress
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Track your learning journey and achievements.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                  {stat.value}
                </h2>
              </div>
              <div
                className={`p-3.5 ${stat.bg} ${stat.color} border rounded-2xl text-xl shadow-sm`}
              >
                <stat.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Progress */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5">
          Course Progress
        </h2>
        {enrollments.length === 0 ? (
          <div className="bg-[#0f172a] rounded-2xl p-10 border border-slate-800 shadow-sm text-center">
            <div className="w-16 h-16 bg-[#0b0f19] border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaBookOpen className="text-3xl text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              No courses yet
            </h3>
            <p className="text-slate-400 mt-1 mb-6">
              Start enrolling in courses to track your progress.
            </p>
            <Link
              to="/my-courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b253b] hover:bg-[#232f4a] text-white rounded-xl font-medium transition border border-slate-700/60 shadow-sm"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment, idx) => {
              const progress = enrollment.progress || 0;
              return (
                <div
                  key={idx}
                  className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-slate-700 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white">
                        {enrollment.courseName || enrollment.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {enrollment.completedLessons || 0} of{" "}
                        {enrollment.totalLessons || 0} lessons completed
                      </p>
                    </div>
                    <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#0b0f19] border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quiz Performance */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5">
          Quiz Performance
        </h2>
        {quizResults.length === 0 ? (
          <div className="bg-[#0f172a] rounded-2xl p-10 border border-slate-800 shadow-sm text-center">
            <div className="w-16 h-16 bg-[#0b0f19] border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-3xl text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              No quiz results yet
            </h3>
            <p className="text-slate-400 mt-1 mb-6">
              Take a quiz to see your performance here.
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b253b] hover:bg-[#232f4a] text-white rounded-xl font-medium transition border border-slate-700/60 shadow-sm"
            >
              Take a Quiz
            </Link>
          </div>
        ) : (
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-800">
              {quizResults.map((result, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-5 hover:bg-slate-900/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center shadow-sm">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {result.quizName || result.quizTitle || result.title || "Quiz"}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {result.createdAt || result.date
                          ? new Date(result.createdAt || result.date).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-extrabold ${
                        result.score >= 70
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {result.score}%
                    </span>
                    {result.score >= 70 && (
                      <FaArrowUp className="text-emerald-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Progress;