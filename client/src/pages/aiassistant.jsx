import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaRobot,
  FaPaperPlane,
  FaSpinner,
  FaBookOpen,
  FaBrain,
  FaClipboardList,
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/authcontext";
import { useToast } from "../context/toastcontext";

function AiAssistant() {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseContext, setCourseContext] = useState(null);
  const [lessonContext, setLessonContext] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const res = await api.get("/courses/my-courses");
        setEnrolledCourses(res.data || []);
      } catch (err) {}
    };
    fetchEnrolled();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customMessage) => {
    const message = customMessage || input;
    if (!message.trim() || loading) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/ask", {
        message,
        courseContext: courseContext || (enrolledCourses.length > 0 ? enrolledCourses.map(c => c.title).join(", ") : "General knowledge"),
        lessonContext,
      });
      const aiMessage = { role: "assistant", content: res.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to get AI response. Please try again.";
      toast.error(msg);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      label: "Explain a Topic",
      icon: FaBookOpen,
      message: "Explain this topic to me in simple terms",
      color: "text-indigo-400",
      bg: "bg-indigo-950/60",
      border: "border-indigo-800/40",
    },
    {
      label: "Generate Quiz",
      icon: FaClipboardList,
      message: "Generate a quiz based on what I've been learning",
      color: "text-purple-400",
      bg: "bg-purple-950/60",
      border: "border-purple-800/40",
    },
    {
      label: "Help Me Study",
      icon: FaBrain,
      message: "Help me create a study plan for my current courses",
      color: "text-emerald-400",
      bg: "bg-emerald-950/60",
      border: "border-emerald-800/40",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-[#070b14] text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header Banner */}
      <div className="mb-6 bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950/80 border border-indigo-800/40 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center shrink-0 text-indigo-400">
            <FaRobot className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Learning Assistant
            </h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">
              Ask questions, get explanations, and boost your learning.
            </p>
          </div>
        </div>
      </div>

      {/* No Enrolled Courses Warning */}
      {enrolledCourses.length === 0 && (
        <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <FaBookOpen className="text-3xl text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-amber-300">No courses enrolled yet</h3>
          <p className="text-sm text-amber-400/80 mt-1 max-w-md mx-auto">
            You haven't enrolled in any courses yet. To get the best AI-powered answers, enroll in a course first and ask questions related to your learning material.
          </p>
          <a
            href="/my-courses"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-sm font-semibold hover:bg-amber-500/30 transition"
          >
            Browse Courses
          </a>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(action.message)}
            disabled={loading}
            className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all duration-200 flex items-center gap-3 text-left disabled:opacity-50 group"
          >
            <div
              className={`w-10 h-10 ${action.bg} border ${action.border} ${action.color} rounded-xl flex items-center justify-center shrink-0`}
            >
              <action.icon className="text-base" />
            </div>
            <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#0b1222] rounded-2xl border border-slate-800/80 p-4 sm:p-6 space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-[#0f192e] border border-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
              <FaRobot className="text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Ask me anything!
            </h3>
            <p className="text-slate-400 mt-1 text-sm max-w-sm">
              Ask me anything about what you're learning, and I'll help you
              understand.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-[#0d1527] border border-slate-800/80 text-slate-200 rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <FaRobot className="text-indigo-400 text-xs" />
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#0d1527] border border-slate-800/80 rounded-2xl rounded-bl-md px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <FaSpinner className="animate-spin text-indigo-400 text-sm" />
                    <span className="text-sm text-slate-400 font-medium">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-2.5 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-3 bg-[#0d1527] border border-slate-800/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="w-11 h-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <FaPaperPlane className="text-xs" />
        </button>
      </div>
    </div>
  );
}

export default AiAssistant;