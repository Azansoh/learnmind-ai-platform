import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import MyCourses from "./pages/mycourses";
import Course from "./pages/course";
import Lesson from "./pages/lesson";
import ProgressPage from "./pages/progress";
import AiAssistant from "./pages/aiassistant";
import QuizPage from "./pages/quiz";
import StudyPlanner from "./pages/studyplanner";
import Settings from "./pages/settings";
import DashLayout from "./layouts/dashlayout";
import ProtectedRoute from "./components/protectedroute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashLayout>
                <Dashboard />
              </DashLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <DashLayout>
                <MyCourses />
              </DashLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <DashLayout>
                <Course />
              </DashLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <DashLayout>
                <Lesson />
              </DashLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <DashLayout>
                <ProgressPage />
              </DashLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <DashLayout>
                <AiAssistant />
              </DashLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <DashLayout>
                <QuizPage />
              </DashLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-planner"
          element={
            <ProtectedRoute>
              <DashLayout>
                <StudyPlanner />
              </DashLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashLayout>
                <Settings />
              </DashLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
