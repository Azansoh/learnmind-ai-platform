import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaSpinner,
  FaPlus,
  FaTrash,
  FaCheck,
  FaClock,
  FaEdit,
  FaTimes,
  FaTasks,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/toastcontext";

function StudyPlanner() {
  const toast = useToast();
  const [plan, setPlan] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    date: "",
    duration: "",
  });
  const [newGoal, setNewGoal] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await api.get("/studyplan");
      setPlan(res.data);
      setNewGoal(res.data.dailyGoal || "");
    } catch (error) {
      console.error("Failed to fetch study plan:", error);
      toast.error("Failed to load study plan.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(`${dateString.split("T")[0]}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUpdateGoal = async () => {
    if (!newGoal.trim()) {
      toast.error("Please enter a goal.");
      return;
    }
    try {
      await api.put("/studyplan/goal", { dailyGoal: newGoal });
      setPlan((prev) => ({ ...prev, dailyGoal: newGoal }));
      setEditingGoal(false);
      toast.success("Daily goal updated!");
    } catch (error) {
      toast.error("Failed to update goal. Please try again.");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title.");
      return;
    }

    try {
      const res = await api.post("/studyplan/task", newTask);
      setNewTask({ title: "", date: "", duration: "" });
      toast.success("Task added successfully!");

      if (res.data?.tasks) {
        setPlan(res.data);
      } else {
        fetchPlan();
      }
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
    }
  };

  const handleToggleTask = async (taskId) => {
    setPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t._id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));

    try {
      await api.put(`/studyplan/task/${taskId}/toggle`);
      toast.success("Task status updated!");
    } catch (error) {
      toast.error("Failed to update task.");
      fetchPlan();
    }
  };

  const handleDeleteTask = async (taskId) => {
    setPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t._id !== taskId),
    }));

    try {
      await api.delete(`/studyplan/task/${taskId}`);
      toast.success("Task deleted!");
    } catch (error) {
      toast.error("Failed to delete task.");
      fetchPlan();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#070b14]">
        <FaSpinner className="animate-spin text-3xl text-indigo-500" />
      </div>
    );
  }

  const tasks = [...(plan?.tasks || [])].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  const completedTasks = tasks.filter((t) => t.completed).length;
  const remainingTasks = tasks.length - completedTasks;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-950/60 border border-indigo-800/40 rounded-2xl flex items-center justify-center text-indigo-400">
          <FaCalendarAlt className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Study Planner
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Organize your tasks and achieve your daily goals.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Tasks
            </p>
            <p className="text-3xl font-extrabold mt-2 text-white">
              {tasks.length}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-950/80 rounded-2xl flex items-center justify-center text-indigo-400">
            <FaTasks className="text-lg" />
          </div>
        </div>

        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completed
            </p>
            <p className="text-3xl font-extrabold mt-2 text-emerald-400">
              {completedTasks}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-950/60 rounded-2xl flex items-center justify-center text-emerald-400">
            <FaCheckCircle className="text-lg" />
          </div>
        </div>

        <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Remaining
            </p>
            <p className="text-3xl font-extrabold mt-2 text-amber-400">
              {remainingTasks}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-400">
            <FaHourglassHalf className="text-lg" />
          </div>
        </div>
      </div>

      {/* Daily Goal Card */}
      <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Daily Goal</h2>
          {!editingGoal ? (
            <button
              onClick={() => setEditingGoal(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              <FaEdit className="text-xs" />
              Edit
            </button>
          ) : (
            <button
              onClick={() => setEditingGoal(false)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-300 transition"
            >
              <FaTimes className="text-xs" />
              Cancel
            </button>
          )}
        </div>
        {editingGoal ? (
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="e.g. Study for 2 hours daily"
              className="flex-1 px-4 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              onClick={handleUpdateGoal}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition"
            >
              Save
            </button>
          </div>
        ) : (
          <p className="text-slate-300">
            {plan?.dailyGoal || (
              <span className="text-slate-500 italic">
                No goal set. Click edit to add one.
              </span>
            )}
          </p>
        )}
      </div>

      {/* Add Task Form */}
      <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Add New Task</h2>
        <form onSubmit={handleAddTask} className="space-y-3">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Task title..."
            className="w-full px-4 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="date"
              value={newTask.date}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, date: e.target.value }))
              }
              className="px-4 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition [color-scheme:dark]"
            />
            <input
              type="text"
              value={newTask.duration}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, duration: e.target.value }))
              }
              placeholder="Duration (e.g. 30 min)"
              className="px-4 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={!newTask.title.trim()}
            className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus className="text-xs" />
            Add Task
          </button>
        </form>
      </div>

      {/* Tasks List */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5">Tasks</h2>
        {tasks.length === 0 ? (
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#0f192e] border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <FaCalendarAlt className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              No tasks yet
            </h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Add your first study task to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`rounded-2xl p-5 border flex items-center justify-between gap-4 transition ${
                  task.completed
                    ? "border-emerald-900/50 bg-[#09151e]"
                    : "bg-[#0b1222] border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task._id)}
                    className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                      task.completed
                        ? "bg-emerald-500 border-emerald-500 text-slate-950"
                        : "border-slate-700 bg-[#0d1527] hover:border-indigo-500"
                    }`}
                  >
                    {task.completed && <FaCheck className="text-xs font-bold" />}
                  </button>
                  <div className="min-w-0">
                    <p
                      className={`font-semibold ${
                        task.completed
                          ? "text-slate-500 line-through"
                          : "text-slate-100"
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      {task.date && (
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-[10px]" />
                          {formatDate(task.date)}
                        </span>
                      )}
                      {task.duration && (
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[10px]" />
                          {task.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-red-950/40 hover:text-red-400 transition"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyPlanner;