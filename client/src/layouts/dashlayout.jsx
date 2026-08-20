import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaRobot,
  FaBookOpen,
  FaChartLine,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
  FaClipboardList,
} from "react-icons/fa";
import { useAuth } from "../context/authcontext";
import api from "../services/api";
import ConfirmModal from "../components/confirmmodal";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: FaHome },
  { label: "My Courses", path: "/my-courses", icon: FaBookOpen, badge: "count" },
  { label: "Progress", path: "/progress", icon: FaChartLine },
  { label: "AI Assistant", path: "/ai-assistant", icon: FaRobot, badge: "PRO" },
  { label: "AI Quizzes", path: "/quiz", icon: FaClipboardList, badge: "AI" },
  { label: "Study Planner", path: "/study-planner", icon: FaCalendarAlt },
];

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DashLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get("/courses/my-courses");
        const courses = Array.isArray(res.data) ? res.data : res.data.courses || [];
        setEnrolledCount(courses.length);
      } catch (err) {
        console.error("Failed to fetch enrolled count:", err);
      }
    };
    fetchCount();
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <FaRobot className="text-white text-sm" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">LearnMind</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className="text-base" />
              <span className="flex-1">{item.label}</span>
              {item.badge === "PRO" && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400">
                  PRO
                </span>
              )}
              {item.badge === "AI" && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400">
                  AI
                </span>
              )}
              {item.badge === "count" && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-700 text-slate-300">
                  {enrolledCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-slate-800 space-y-1">
        <Link
          to="/settings"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === "/settings"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          <FaCog className="text-base" />
          <span>Settings</span>
        </Link>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-red-400 transition-colors"
        >
          <FaSignOutAlt className="text-base" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your courses and progress."
        confirmText="Yes, Logout"
        danger
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="lg:hidden flex justify-end p-3">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
        <div className="lg:hidden -mt-8">{sidebarContent}</div>
        <div className="hidden lg:block h-full">{sidebarContent}</div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-4 px-4 lg:px-6 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <FaBars className="text-lg" />
            </button>

            <div className="hidden sm:flex items-center flex-1 max-w-md bg-slate-900 rounded-lg border border-slate-800 px-3 py-2">
              <FaSearch className="text-slate-500 text-sm mr-2" />
              <input
                type="text"
                placeholder="Search courses, topics..."
                className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button className="relative text-slate-400 hover:text-white p-2">
                <FaBell className="text-lg" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user?.name)}
                </div>
                <span className="hidden md:block text-sm text-slate-200 font-medium">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}