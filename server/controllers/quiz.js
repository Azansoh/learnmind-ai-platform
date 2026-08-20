import Quiz from "../models/quiz.js";
import QuizResult from "../models/quizresult.js";
import Activity from "../models/activity.js";

export const getQuizzesByCourse = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId }).select(
      "-questions.correctAnswer -questions.explanation"
    );
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const safeQuestions = quiz.questions.map((q) => ({
      question: q.question,
      options: q.options,
    }));
    res.json({
      _id: quiz._id,
      title: quiz.title,
      questions: safeQuestions,
      timeLimit: quiz.timeLimit,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    const detailedAnswers = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) score++;
      return { questionIndex: i, selectedAnswer: answers[i], isCorrect };
    });

    const result = await QuizResult.create({
      user: req.user._id,
      quiz: quiz._id,
      answers: detailedAnswers,
      score,
      totalQuestions: quiz.questions.length,
    });

    await Activity.create({
      user: req.user._id,
      type: "quiz_complete",
      description: `Scored ${score}/${quiz.questions.length} on "${quiz.title}"`,
      course: quiz.course,
    });

    const detailed = quiz.questions.map((q, i) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      selectedAnswer: answers[i],
      isCorrect: answers[i] === q.correctAnswer,
    }));

    res.json({ score, totalQuestions: quiz.questions.length, details: detailed });
  } catch (error) {
    next(error);
  }
};

export const getMyResults = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ user: req.user._id })
      .populate("quiz")
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    next(error);
  }
};
