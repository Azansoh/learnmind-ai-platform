import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/course.js";

dotenv.config();

const courses = [
  {
    title: "Complete React.js Course",
    description:
      "Learn React from the basics to advanced concepts and build real-world applications.",
    category: "Frontend Development",
    level: "Intermediate",
    instructor: "Sarah Johnson",
    duration: "8h 30m",
    totalLessons: 8,
    lessons: [
      { title: "Introduction to React", description: "What is React and why use it", content: "React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of developers.", duration: "15 min", order: 1 },
      { title: "Setting Up React Project", description: "Create your first React app with Vite", content: "We'll use Vite to create a new React project. Run: npm create vite@latest my-app -- --template react. Then cd into the folder and run npm install.", duration: "20 min", order: 2 },
      { title: "JSX Fundamentals", description: "Learn JSX syntax and how it works", content: "JSX is a syntax extension for JavaScript that looks similar to HTML. It gets converted to React.createElement() calls. You can embed any JavaScript expression in JSX using curly braces {}.", duration: "25 min", order: 3 },
      { title: "Components", description: "Understanding functional components", content: "Components are reusable pieces of UI. In modern React, we use functional components. A component is simply a JavaScript function that returns JSX.", duration: "30 min", order: 4 },
      { title: "Props and State", description: "Passing data and managing state", content: "Props are data passed from parent to child. State is data managed inside a component using the useState hook. When state changes, the component re-renders.", duration: "35 min", order: 5 },
      { title: "Event Handling", description: "Handle user interactions in React", content: "React uses a synthetic event system. You handle events like onClick, onChange, onSubmit directly on JSX elements.", duration: "20 min", order: 6, videoUrl: "https://www.youtube.com/embed/Zbk-8vFpvL4" },
      { title: "React Hooks", description: "useState, useEffect, and custom hooks", content: "Hooks let you use state and other React features in functional components. useState manages state, useEffect handles side effects.", duration: "40 min", order: 7, videoUrl: "https://www.youtube.com/embed/dpw9EHDh2bM" },
      { title: "React Router", description: "Navigation between pages in React", content: "React Router enables navigation in a React app. Use BrowserRouter, Routes, Route, Link, and useParams for dynamic routes.", duration: "25 min", order: 8, videoUrl: "https://www.youtube.com/embed/Ul3y1LXxzdU" },
    ],
  },
  {
    title: "JavaScript Mastery",
    description:
      "Master modern JavaScript concepts and improve your web development skills.",
    category: "Web Development",
    level: "Beginner",
    instructor: "Mike Chen",
    duration: "10h 20m",
    totalLessons: 8,
    lessons: [
      { title: "JavaScript Basics", description: "Your first JavaScript program", content: "JavaScript is the programming language of the web. You can run it in browsers and on servers (Node.js). Start with console.log('Hello World').", duration: "20 min", order: 1 },
      { title: "Variables and Data Types", description: "let, const, and data types", content: "Use 'const' for values that don't change, 'let' for values that do. JavaScript has strings, numbers, booleans, null, undefined, objects, and arrays.", duration: "25 min", order: 2 },
      { title: "Functions", description: "Arrow functions and function expressions", content: "Functions are reusable blocks of code. Modern JS uses arrow functions: const greet = (name) => `Hello ${name}`.", duration: "30 min", order: 3 },
      { title: "Arrays", description: "Working with arrays and array methods", content: "Arrays store multiple values. Key methods: map(), filter(), reduce(), find(), forEach().", duration: "35 min", order: 4, videoUrl: "https://www.youtube.com/embed/R8rmcDlAhLQ" },
      { title: "Objects", description: "Object creation and manipulation", content: "Objects store data as key-value pairs. Use dot notation or bracket notation. Destructuring makes working with objects easier.", duration: "30 min", order: 5 },
      { title: "DOM Manipulation", description: "Interact with the webpage", content: "The DOM lets you manipulate HTML and CSS with JavaScript. Use document.querySelector(), addEventListener(), and element.classList.", duration: "25 min", order: 6 },
      { title: "ES6+ Features", description: "Template literals, destructuring, spread", content: "ES6 introduced template literals, destructuring, spread/rest operators, optional chaining, and modules.", duration: "35 min", order: 7, videoUrl: "https://www.youtube.com/embed/NCgzDRAfmj0" },
      { title: "Async JavaScript", description: "Promises, async/await", content: "Asynchronous code runs later. Promises represent future values. async/await makes async code look synchronous.", duration: "40 min", order: 8, videoUrl: "https://www.youtube.com/embed/vn3tmFrquoY" },
    ],
  },
  {
    title: "Python for Beginners",
    description:
      "Start programming with Python and learn the fundamentals step by step.",
    category: "Programming",
    level: "Beginner",
    instructor: "Emma Davis",
    duration: "6h 15m",
    totalLessons: 8,
    lessons: [
      { title: "Introduction to Python", description: "Why learn Python?", content: "Python is one of the most popular programming languages. It's used in web development, data science, AI, automation, and more.", duration: "15 min", order: 1 },
      { title: "Variables", description: "Creating and using variables", content: "Variables store data. In Python: name = 'Alice', age = 25, is_student = True.", duration: "20 min", order: 2 },
      { title: "Data Types", description: "Strings, integers, floats, booleans", content: "Python has built-in types: str, int, float, bool, list, dict, tuple, set.", duration: "25 min", order: 3 },
      { title: "Conditional Statements", description: "if, elif, else", content: "Use if/elif/else to make decisions. Python uses indentation to define code blocks.", duration: "30 min", order: 4 },
      { title: "Loops", description: "for and while loops", content: "for loops iterate over sequences: for i in range(10). while loops repeat until a condition is false.", duration: "30 min", order: 5, videoUrl: "https://www.youtube.com/embed/94UHCEmprCY" },
      { title: "Functions", description: "Defining and calling functions", content: "Functions group reusable code: def greet(name): return f'Hello {name}'.", duration: "25 min", order: 6 },
      { title: "Lists and Dictionaries", description: "Working with collections", content: "Lists are ordered collections. Dictionaries are key-value pairs. Both are mutable and essential.", duration: "35 min", order: 7 },
      { title: "Object Oriented Programming", description: "Classes and objects in Python", content: "OOP organizes code into classes and objects. Use __init__ for constructors, self for instance references.", duration: "40 min", order: 8, videoUrl: "https://www.youtube.com/embed/ZDa-Z5JBGxY" },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await Course.deleteMany({});
    console.log("Cleared existing courses");
    await Course.insertMany(courses);
    console.log(`Seeded ${courses.length} courses with lessons`);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
