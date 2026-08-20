import {
  ArrowRight,
  Brain,
  BookOpen,
  ChartNoAxesCombined,
  MessageCircle,
  Sparkles,
  Target,
  Clock,
  Users,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import api from "../services/api";

function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              AI-Powered Learning Platform
            </div>

            {/* Main Title */}
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
              Learn smarter. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Not harder.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              LearnMind AI is your personal study assistant. Master complex concepts, test your knowledge with AI-generated quizzes, and track your growth effortlessly.
            </p>

            {/* Call to Actions */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-violet-700 hover:shadow-indigo-500/40 active:scale-[0.98]"
              >
                Start Learning Free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 px-7 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white active:scale-[0.98]"
              >
                Explore Features
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative border-t border-slate-800/60 bg-slate-900/40 py-28 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to excel
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Powerful tools driven by modern artificial intelligence to transform the way you absorb knowledge.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: "AI Tutor",
                desc: "Ask deep questions and get instant, context-aware explanations tailored to your learning style.",
              },
              {
                icon: BookOpen,
                title: "Smart Learning",
                desc: "Learn from dynamically structured study materials with AI guidance whenever you hit a roadblock.",
              },
              {
                icon: Target,
                title: "AI Quizzes",
                desc: "Instantly generate custom quizzes to challenge your retention and target weak subjects.",
              },
              {
                icon: ChartNoAxesCombined,
                title: "Progress Tracking",
                desc: "Visualize your streaks, quiz accuracy, and subject mastery through actionable data.",
              },
              {
                icon: Brain,
                title: "Adaptive AI",
                desc: "An intelligent core that evolves with your input, pace, and specific educational goals.",
              },
              {
                icon: Sparkles,
                title: "Intelligent Insights",
                desc: "Receive customized feedback on study patterns and personalized tips for long-term growth.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your learning journey, simplified
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose what to learn",
                desc: "Pick any topic, upload study notes, or select a custom module to begin.",
              },
              {
                step: "02",
                title: "Learn with AI",
                desc: "Engage with your AI tutor, clarify doubts in real-time, and auto-generate drills.",
              },
              {
                step: "03",
                title: "Track your progress",
                desc: "Monitor your score improvements and solidify your mastery effortlessly.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-slate-800/60 bg-slate-900/30 p-8 text-center backdrop-blur-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg font-bold text-indigo-400 border border-indigo-500/20">
                  {item.step}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Courses Section */}
      {courses.length > 0 && (
        <section id="courses" className="py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Courses
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start learning today
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Browse our expert-crafted courses and begin your learning journey with AI-powered guidance.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  {/* Course Image */}
                  <div
                    className={`relative h-40 bg-gradient-to-r ${course.gradient || "from-blue-600 to-indigo-600"} flex items-center justify-center overflow-hidden`}
                  >
                    <BookOpen className="text-5xl text-white opacity-20 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-slate-800 backdrop-blur-sm uppercase tracking-wider">
                      {course.level}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <PlayCircle className="text-xs" />
                        {course.lessons?.length || 0} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="text-xs" />
                        {course.duration}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/60">
                      <Link
                        to="/register"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-semibold border border-indigo-500/20 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
                      >
                        Enroll Now
                        <ArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View all courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section id="about" className="relative overflow-hidden border-t border-slate-800/80 bg-slate-900/60 py-24 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Ready to master any topic?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Join LearnMind AI today and elevate your studying experience.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-violet-700 hover:shadow-indigo-500/40 active:scale-[0.98]"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Brain className="h-4 w-4" />
            </div>
            <span className="font-semibold text-white tracking-wide">
              LearnMind AI
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} LearnMind AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;