# LearnMind AI

An AI-powered smart learning platform built with React, Node.js, Express, MongoDB, and Mistral AI. Students can enroll in courses, track progress, chat with an AI tutor, take AI-generated quizzes, and manage study plans.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| React Router DOM 7 | Client-side routing |
| Tailwind CSS 4 | Utility-first styling |
| Axios | HTTP client for API calls |
| React Icons | Icon library |
| Lucide React | Additional icons |
| Recharts | Charts & data visualization |
| Zustand | State management |
| TanStack React Query | Server state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express 5 | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose 8 | MongoDB ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password hashing |
| cookie-parser | Cookie handling |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |

### AI Integration
| Technology | Purpose |
|---|---|
| Mistral AI API | AI chat responses & quiz generation |
| Model: mistral-small-latest | Language model for natural conversations |

---

## Features

### Authentication
- User registration with validation
- Login with JWT cookie-based authentication
- Protected routes with middleware
- Logout with cookie clearing

### Course Management
- Browse available courses (React, JavaScript, Python)
- Enroll / unenroll from courses with confirmation modals
- Course detail page with lessons list
- Lesson page with video embed (YouTube) and written content
- Mark lessons as complete with progress tracking
- Real-time progress percentage calculation

### AI Learning Assistant
- Chat with Mistral AI tutor
- Context-aware responses (sends enrolled course info)
- Quick action buttons for common queries
- Empty state warning when no courses enrolled

### AI Quiz Generator
- Generate quizzes on any topic via Mistral AI
- Generate quizzes from enrolled course topics
- Multiple choice questions with 4 options
- Score tracking with detailed explanations
- Pass/fail feedback (70% threshold)

### Study Planner
- Create, complete, and delete study tasks
- Set daily study goals
- Task scheduling with date and duration
- Stats overview (total, completed, remaining)

### Progress Tracking
- Dashboard with key metrics (courses, lessons, average progress)
- Recent activity feed
- Learning progress cards per course
- Charts and statistics

### Settings
- Update profile (name, email) saved to MongoDB
- Change password with current password verification
- Notification toggle

### UI/UX
- Dark theme with slate/indigo color palette
- Custom styled confirmation modals (no browser alerts)
- Toast notification system (success, error, info)
- Mobile responsive sidebar layout
- Loading spinners and skeleton states

---

## Project Structure

```
LearnMind_AI/
├── server/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── auth.js                  # Register, login, profile, password
│   │   ├── course.js                # Courses, enroll, lessons, progress
│   │   ├── ai.js                    # AI chat & quiz generation
│   │   ├── quiz.js                  # Quiz results CRUD
│   │   ├── studyplan.js             # Study plan & tasks
│   │   └── activity.js              # Activity feed
│   ├── middleware/
│   │   └── auth.js                  # JWT protect & adminOnly middleware
│   ├── models/
│   │   ├── user.js                  # User schema
│   │   ├── course.js                # Course schema with embedded lessons
│   │   ├── enrollment.js            # Enrollment tracking
│   │   ├── quiz.js                  # Quiz schema
│   │   ├── quizresult.js            # Quiz result schema
│   │   ├── studyplan.js             # Study plan schema
│   │   └── activity.js              # Activity log schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── course.js
│   │   ├── ai.js
│   │   ├── quiz.js
│   │   ├── studyplan.js
│   │   └── activity.js
│   ├── server.js                    # Express entry point
│   ├── seed.js                      # Seed 3 courses with lessons
│   ├── package.json
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── protectedroute.jsx   # Auth route guard
│   │   │   ├── confirmmodal.jsx     # Styled confirmation modal
│   │   │   └── navbar.jsx           # Public navbar
│   │   ├── context/
│   │   │   ├── authcontext.jsx      # Auth state & methods
│   │   │   └── toastcontext.jsx     # Toast notification system
│   │   ├── layouts/
│   │   │   └── dashlayout.jsx       # Sidebar + header layout
│   │   ├── pages/
│   │   │   ├── home.jsx             # Landing page with course cards
│   │   │   ├── login.jsx            # Login form
│   │   │   ├── register.jsx         # Registration form
│   │   │   ├── dashboard.jsx        # Stats, activity, courses overview
│   │   │   ├── mycourses.jsx        # Enrolled + browse courses
│   │   │   ├── course.jsx           # Course detail + lessons
│   │   │   ├── lesson.jsx           # Video + content + mark complete
│   │   │   ├── progress.jsx         # Progress stats & charts
│   │   │   ├── aiassistant.jsx      # AI chat interface
│   │   │   ├── quiz.jsx             # AI quiz generator
│   │   │   ├── studyplanner.jsx     # Tasks & goals
│   │   │   └── settings.jsx         # Profile, password, notifications
│   │   ├── services/
│   │   │   └── api.js               # Axios instance (localhost:5000)
│   │   ├── App.jsx                  # All routes
│   │   ├── main.jsx                 # App entry with providers
│   │   └── index.css                # Tailwind imports
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/logout` | Logout user |
| PUT | `/api/auth/update-profile` | Update name/email (protected) |
| PUT | `/api/auth/change-password` | Change password (protected) |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course with lessons |
| GET | `/api/courses/my-courses` | Get enrolled courses (protected) |
| POST | `/api/courses/:courseId/enroll` | Enroll in course (protected) |
| DELETE | `/api/courses/:courseId/unenroll` | Unenroll from course (protected) |
| GET | `/api/courses/:courseId/lesson/:lessonId` | Get lesson (protected) |
| POST | `/api/courses/:courseId/lesson/:lessonId/complete` | Mark lesson complete (protected) |
| GET | `/api/courses/progress` | Get progress stats (protected) |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/ask` | Ask AI assistant (protected) |
| POST | `/api/ai/generate-quiz` | Generate AI quiz (protected) |

### Quizzes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quizzes` | Get all quizzes (protected) |
| POST | `/api/quizzes` | Create quiz (protected) |
| POST | `/api/quizzes/results` | Save quiz result (protected) |
| GET | `/api/quizzes/results` | Get quiz results (protected) |

### Study Plan
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/studyplan` | Get study plan (protected) |
| PUT | `/api/studyplan/goal` | Update daily goal (protected) |
| POST | `/api/studyplan/task` | Add task (protected) |
| PUT | `/api/studyplan/task/:taskId/toggle` | Toggle task (protected) |
| DELETE | `/api/studyplan/task/:taskId` | Delete task (protected) |

### Activities
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activities` | Get activity feed (protected) |

---

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
MISTRAL_API_KEY=your_mistral_api_key
NODE_ENV=development
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Mistral AI API key (free at https://mistral.ai)

### Backend
```bash
cd server
npm install
npm run seed      # Seed 3 courses into database
npm run dev       # Start on port 5000
```

### Frontend
```bash
cd client
npm install
npm run dev       # Start on port 5173
```

### Open
```
http://localhost:5173
```

---

## Seeded Courses

| Course | Level | Lessons |
|---|---|---|
| Complete React.js Course | Intermediate | 8 lessons |
| JavaScript Mastery | Beginner | 8 lessons |
| Python for Beginners | Beginner | 8 lessons |

---

## Deployment (Railway)

### Steps
1. Push code to GitHub
2. Go to https://railway.app
3. Create new project → Deploy from GitHub repo
4. Add MongoDB Atlas service (or use existing connection string)
5. Set environment variables in Railway dashboard
6. Railway will auto-detect and build both server and client

### Environment Variables for Railway
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
MISTRAL_API_KEY=your_mistral_api_key
NODE_ENV=production
```

---

## Author

**M.Sohail** - Full Stack Developer

Built with React, Node.js, Express, MongoDB, and Mistral AI.
