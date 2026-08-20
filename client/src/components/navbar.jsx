import { Link } from "react-router-dom";
import { Brain } from "lucide-react";


function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
            <Brain className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold text-slate-900">
            LearnMind AI
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            About
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:block"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;