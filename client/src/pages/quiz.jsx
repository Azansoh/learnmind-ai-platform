import { useState, useEffect } from "react";
import {
  FaStar,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaBookOpen,
  FaArrowLeft,
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/authcontext";
import { useToast } from "../context/toastcontext";

function Quiz() {
  const { user } = useAuth();
  const toast = useToast();
  const [topics, setTopics] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/my-courses");
        const data = res.data.courses || res.data || [];
        setTopics(data);
        setEnrolledCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleGenerateQuiz = async (topic) => {
    const selectedTopic = topic || customTopic;
    if (!selectedTopic.trim()) return;

    setLoading(true);
    setActiveQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setResult(null);

    try {
      const courseNames = enrolledCourses.map(c => c.title).join(", ");
      const res = await api.post("/ai/generate-quiz", {
        topic: selectedTopic,
        courseContext: courseNames || "No courses enrolled",
      });
      setActiveQuiz(res.data);
      toast.success("Quiz generated successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to generate quiz. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleSubmitQuiz = async () => {
    const questions = activeQuiz?.questions || [];
    if (questions.length === 0) return;

    let correctCount = 0;
    const detailedResults = questions.map((q, idx) => {
      const selectedAnswer = answers[idx];
      const isCorrect = selectedAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        options: q.options,
        selectedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const quizResultData = {
      score: correctCount,
      total: questions.length,
      percentage,
      details: detailedResults,
    };

    setResult(quizResultData);
    setSubmitted(true);

    try {
      await api.post("/quizzes/results", {
        quizTitle: activeQuiz.title || activeQuiz.topic || "Generated Quiz",
        score: percentage,
        details: detailedResults,
      });
    } catch (error) {
      console.error("Failed to save quiz results:", error);
    }

    if (percentage >= 70) {
      toast.success(`Great job! You scored ${percentage}%!`);
    } else {
      toast.info(`You scored ${percentage}%. Keep studying and try again!`);
    }
  };

  if (fetchingCourses) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen bg-[#060913]">
        <FaSpinner className="animate-spin text-3xl text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] p-4 sm:p-6 lg:p-8 text-slate-200">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-sm">
            <FaStar className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Quiz Generator
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Test your knowledge with AI-generated quizzes.
            </p>
          </div>
        </div>
      </div>

      {/* No Enrolled Courses Warning */}
      {enrolledCourses.length === 0 && !activeQuiz && !loading && (
        <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <FaBookOpen className="text-3xl text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-amber-300">No courses enrolled yet</h3>
          <p className="text-sm text-amber-400/80 mt-1 max-w-md mx-auto">
            You haven't enrolled in any courses yet. To generate relevant AI quizzes, enroll in a course first. You can still generate quizzes on any topic using the custom topic input below.
          </p>
          <a
            href="/my-courses"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-sm font-semibold hover:bg-amber-500/30 transition"
          >
            Browse Courses
          </a>
        </div>
      )}

      {/* Active Quiz View */}
      {activeQuiz && (
        <div className="mb-10">
          {submitted ? (
            /* Results */
            <div>
              <div className="bg-[#0f172a] rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm mb-6">
                <div className="text-center mb-6">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                      result.percentage >= 70
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    <FaCheckCircle className="text-4xl" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white">
                    {result.percentage}%
                  </h2>
                  <p className="text-slate-400 font-medium mt-1">
                    {result.score} out of {result.total} correct
                  </p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                {result.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className={`bg-[#0f172a] rounded-2xl p-6 border shadow-sm ${
                      detail.isCorrect
                        ? "border-emerald-500/30 bg-emerald-950/10"
                        : "border-red-500/30 bg-red-950/10"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {detail.isCorrect ? (
                        <FaCheckCircle className="text-emerald-400 mt-1 shrink-0 text-lg" />
                      ) : (
                        <FaTimesCircle className="text-red-400 mt-1 shrink-0 text-lg" />
                      )}
                      <p className="font-semibold text-white">
                        {detail.question}
                      </p>
                    </div>
                    <div className="ml-8 space-y-2">
                      {detail.options.map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${
                            optIdx === detail.correctAnswer
                              ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
                              : optIdx === detail.selectedAnswer &&
                                !detail.isCorrect
                              ? "bg-red-950/50 border-red-500/40 text-red-200"
                              : "bg-[#0b0f19] border-slate-800 text-slate-300"
                          }`}
                        >
                          {option}
                          {optIdx === detail.correctAnswer && (
                            <span className="ml-2 font-bold text-emerald-400">
                              (Correct)
                            </span>
                          )}
                          {optIdx === detail.selectedAnswer &&
                            !detail.isCorrect && (
                              <span className="ml-2 font-bold text-red-400">
                                (Your answer)
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                    {detail.explanation && (
                      <div className="ml-8 mt-3 p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl">
                        <p className="text-sm text-indigo-200">
                          <span className="font-bold text-indigo-400">Explanation: </span>
                          {detail.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setResult(null);
                  setSubmitted(false);
                  setAnswers({});
                }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition border border-slate-700 shadow-sm"
              >
                <FaArrowLeft className="text-sm" />
                Generate Another Quiz
              </button>
            </div>
          ) : (
            /* Quiz Questions */
            <div>
              <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">
                    {activeQuiz.title || "Generated Quiz"}
                  </h2>
                  <span className="text-sm font-semibold text-slate-300 bg-[#0b0f19] px-3 py-1 rounded-full border border-slate-800">
                    {activeQuiz.questions?.length || 0} questions
                  </span>
                </div>
                {activeQuiz.description && (
                  <p className="text-sm text-slate-400">
                    {activeQuiz.description}
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {(activeQuiz.questions || []).map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-sm"
                  >
                    <p className="font-semibold text-white mb-4">
                      <span className="text-purple-400 mr-2 font-bold">Q{qIdx + 1}.</span>
                      {q.question}
                    </p>
                    <div className="space-y-2">
                      {(q.options || []).map((option, oIdx) => (
                        <label
                          key={oIdx}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition ${
                            answers[qIdx] === oIdx
                              ? "border-purple-500/80 bg-purple-950/30 text-purple-200 font-medium"
                              : "border-slate-800 bg-[#0b0f19] text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIdx}`}
                            checked={answers[qIdx] === oIdx}
                            onChange={() => handleAnswerSelect(qIdx, oIdx)}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-700 bg-slate-900"
                          />
                          <span className="text-sm">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmitQuiz}
                disabled={
                  Object.keys(answers).length <
                  (activeQuiz.questions?.length || 0)
                }
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Topic Selection */}
      {!activeQuiz && !loading && (
        <div>
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-white mb-3">
              Custom Topic
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleGenerateQuiz(customTopic)
                }
                placeholder="Enter a topic to quiz on..."
                className="flex-1 px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
              <button
                onClick={() => handleGenerateQuiz(customTopic)}
                disabled={!customTopic.trim()}
                className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaStar className="text-sm" />
                Generate
              </button>
            </div>
          </div>

          {topics.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">
                Or pick a course topic
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleGenerateQuiz(topic.title || topic.name || topic)
                    }
                    className="bg-[#0f172a] rounded-2xl p-5 border border-slate-800 shadow-sm hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 text-left group"
                  >
                    <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <FaBookOpen className="text-lg" />
                    </div>
                    <h3 className="font-semibold text-white">
                      {topic.title || topic.name || "Untitled Course"}
                    </h3>
                    {topic.description && (
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {topic.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-purple-500 mb-4" />
          <p className="text-slate-400 font-medium">
            Generating your quiz...
          </p>
        </div>
      )}
    </div>
  );
}

export default Quiz;