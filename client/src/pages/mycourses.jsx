import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaArrowRight,
  FaPlayCircle,
  FaClock,
  FaUser,
  FaFilter,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/toastcontext";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showEnroll, setShowEnroll] = useState(false);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrolledRes, allRes] = await Promise.all([
        api.get("/courses/my-courses"),
        api.get("/courses"),
      ]);
      setCourses(enrolledRes.data);
      setAllCourses(allRes.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      toast.error("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      toast.success("Successfully enrolled in the course!");
      fetchData();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to enroll. Please try again.";
      toast.error(msg);
    }
  };

  const enrolledIds = courses.map((c) => c._id);

  const filtered = courses.filter((c) => {
    const matchSearch = c.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      c.level.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const availableCourses = allCourses.filter(
    (c) => !enrolledIds.includes(c._id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium text-sm">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <FaBookOpen size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Courses
            </h1>
            <p className="text-slate-400 text-sm">
              {courses.length} enrolled course{courses.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 w-full sm:w-56 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-slate-900/80 border border-slate-800 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">
                All Levels
              </option>
              <option value="beginner" className="bg-slate-900 text-white">
                Beginner
              </option>
              <option value="intermediate" className="bg-slate-900 text-white">
                Intermediate
              </option>
              <option value="advanced" className="bg-slate-900 text-white">
                Advanced
              </option>
            </select>
          </div>

          {/* Enroll Button */}
          <button
            onClick={() => setShowEnroll(!showEnroll)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
          >
            <FaPlus className="text-xs" />
            Enroll
          </button>
        </div>
      </div>

      {/* Enroll Panel */}
      {showEnroll && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Available Courses
          </h2>
          {availableCourses.length === 0 ? (
            <p className="text-slate-400 text-sm">
              You are enrolled in all available courses.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-4 hover:border-slate-700 hover:bg-slate-800/70 transition-all duration-200"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">
                      {course.level}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="shrink-0 ml-4 flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                  >
                    <FaPlus className="text-[10px]" />
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Courses Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="w-20 h-20 bg-slate-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaBookOpen className="text-3xl text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200">
            No courses found
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <div
              key={course._id}
              className="group overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                {/* Course Image Header */}
                <div
                  className={`relative h-44 bg-gradient-to-r ${
                    course.gradient || "from-indigo-600 to-violet-700"
                  } flex items-center justify-center overflow-hidden`}
                >
                  <FaBookOpen className="text-7xl text-white opacity-20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Level Badge */}
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-slate-950/70 text-slate-200 border border-slate-700/50 backdrop-blur-md capitalize">
                    {course.level}
                  </span>

                  {/* Progress Badge */}
                  <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                    {course.progress || 0}% Done
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {course.category}
                  </span>

                  <h2 className="mt-1 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Info */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FaUser className="text-slate-500" />
                      {course.instructor}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FaPlayCircle className="text-slate-500" />
                      {course.lessons?.length || 0} Lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaClock className="text-slate-500" />
                      {course.duration}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-bold text-indigo-400">
                        {course.progress || 0}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                {/* Continue Button */}
                <Link
                  to={`/course/${course._id}`}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-indigo-600 border border-slate-700/60 hover:border-indigo-500 py-3 font-semibold text-white transition-all duration-200 group-hover:shadow-md group-hover:shadow-indigo-500/10"
                >
                  <span>Continue Course</span>
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;