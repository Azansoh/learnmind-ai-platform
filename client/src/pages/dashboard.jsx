import {
  FaBookOpen,
  FaChartLine,
  FaRobot,
  FaArrowRight,
  FaFire,
  FaArrowUp,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/authcontext";

const activityIconMap = {
  lesson_complete: {
    icon: FaBookOpen,
    bg: "bg-indigo-500/10 border border-indigo-500/20",
    color: "text-indigo-400",
  },
  quiz_complete: {
    icon: FaChartLine,
    bg: "bg-emerald-500/10 border border-emerald-500/20",
    color: "text-emerald-400",
  },
  course_enroll: {
    icon: FaBookOpen,
    bg: "bg-purple-500/10 border border-purple-500/20",
    color: "text-purple-400",
  },
  ai_chat: {
    icon: FaRobot,
    bg: "bg-amber-500/10 border border-amber-500/20",
    color: "text-amber-400",
  },
  study_task: {
    icon: FaCalendarAlt,
    bg: "bg-cyan-500/10 border border-cyan-500/20",
    color: "text-cyan-400",
  },
};

function formatTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, coursesRes, activitiesRes] = await Promise.all([
          api.get("/courses/progress"),
          api.get("/courses/my-courses"),
          api.get("/activities"),
        ]);
        setStats(statsRes.data);
        setCourses(coursesRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium text-sm">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Courses",
      val: stats.totalCourses ?? "0",
      trend: "+2 this month",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border border-indigo-500/20",
      icon: FaBookOpen,
    },
    {
      label: "Lessons Completed",
      val: stats.totalLessonsCompleted ?? "0",
      trend: "+8.2% this week",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border border-purple-500/20",
      icon: FaChartLine,
    },
    {
      label: "Average Progress",
      val: `${stats.averageProgress ?? 0}%`,
      trend: "Keep going!",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border border-emerald-500/20",
      icon: FaChartLine,
    },
    {
      label: "Courses Done",
      val: stats.completedCourses ?? "0",
      trend: "67% finish rate",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border border-amber-500/20",
      icon: FaFire,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Welcome back, {user?.name || "Learner"}!
        </h1>
        <p className="text-slate-400 font-medium mt-1 text-sm sm:text-base">
          Continue your learning journey. You&apos;re doing great!
        </p>
      </div>

      {/* Key Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 shadow-lg backdrop-blur-sm hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                {stat.val}
              </h2>
              <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
                <FaArrowUp className="text-[10px]" />
                <span>{stat.trend}</span>
              </div>
            </div>
            <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-2xl text-xl`}>
              <stat.icon />
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 shadow-lg backdrop-blur-sm hover:border-slate-700 transition">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
              <FaBookOpen className="text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-white">Start Learning</h3>
            <p className="text-sm text-slate-400 mt-2">
              Continue your courses and improve your knowledge.
            </p>
            <Link
              to="/my-courses"
              className="mt-4 inline-flex items-center gap-2 text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
            >
              Start Now
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 shadow-lg backdrop-blur-sm hover:border-slate-700 transition">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4">
              <FaRobot className="text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Tutor</h3>
            <p className="text-sm text-slate-400 mt-2">
              Ask questions and get help from your AI learning assistant.
            </p>
            <Link
              to="/ai-assistant"
              className="mt-4 inline-flex items-center gap-2 text-purple-400 font-medium hover:text-purple-300 transition-colors"
            >
              Ask AI
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 shadow-lg backdrop-blur-sm hover:border-slate-700 transition">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <FaChartLine className="text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-white">View Progress</h3>
            <p className="text-sm text-slate-400 mt-2">
              Track your learning progress and see your achievements.
            </p>
            <Link
              to="/progress"
              className="mt-4 inline-flex items-center gap-2 text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
            >
              View Stats
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        </div>
        <div className="bg-slate-900/80 rounded-2xl shadow-lg border border-slate-800/80 divide-y divide-slate-800/80 overflow-hidden">
          {activities.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-14 h-14 bg-slate-800/60 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FaBookOpen className="text-2xl text-slate-500" />
              </div>
              <p className="text-slate-300 font-medium">No recent activity yet.</p>
              <p className="text-slate-500 text-sm mt-1">
                Start a course to see your activity here.
              </p>
            </div>
          ) : (
            activities.slice(0, 5).map((activity, idx) => {
              const { icon: ActivityIcon, bg, color } =
                activityIconMap[activity.type] || activityIconMap.lesson_complete;
              return (
                <div
                  key={activity._id || idx}
                  className="flex items-center justify-between p-5 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 ${bg} ${color} rounded-xl flex items-center justify-center`}>
                      <ActivityIcon />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200">
                        {activity.description}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activity.type
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap ml-4">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Continue Learning */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Continue Learning
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              Resume active course modules where you left off.
            </p>
          </div>
          <Link
            to="/my-courses"
            className="flex items-center gap-2 text-sm text-indigo-400 font-semibold hover:text-indigo-300 transition-colors group"
          >
            <span>View All Courses</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-lg">
            <FaBookOpen className="text-4xl text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No enrolled courses yet.</p>
            <Link
              to="/my-courses"
              className="mt-3 inline-flex items-center gap-2 text-indigo-400 font-medium hover:text-indigo-300"
            >
              Browse Courses
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 shadow-lg hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                      <FaBookOpen className="text-xl" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {course.progress === 100 ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {course.category || "General"}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                    {course.description || "Continue learning to improve your skills."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                    <span>Progress</span>
                    <span className="font-bold text-white">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <Link
                    to={`/course/${course._id}`}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white py-2.5 rounded-xl font-medium text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
                  >
                    <span>Continue Course</span>
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;