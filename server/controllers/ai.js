import Activity from "../models/activity.js";

const DEMO_QUIZ = {
  title: "Quick Knowledge Check",
  questions: [
    {
      question: "What is React?",
      options: ["A database", "A JavaScript library for building UIs", "A programming language", "An operating system"],
      correctAnswer: 1,
      explanation: "React is a JavaScript library developed by Facebook for building user interfaces.",
    },
    {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
      correctAnswer: 0,
      explanation: "HTML stands for Hyper Text Markup Language.",
    },
    {
      question: "Which CSS property controls text size?",
      options: ["text-style", "font-size", "text-size", "font-style"],
      correctAnswer: 1,
      explanation: "The font-size property controls text size in CSS.",
    },
  ],
};

const getApiKey = () => {
  const apiKey = process.env.MISTRAL_API_KEY;
  return apiKey && apiKey !== "your_mistral_api_key_here" ? apiKey : null;
};

const extractTextContent = (content) => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join("");
  }
  return String(content);
};

const extractJson = (text) => {
  if (!text) return null;
  const cleaned = String(text)
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (e) {
      /* malformed braces - fall through to raw parse */
    }
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
};

const sanitizeQuiz = (data) => {
  if (!data || typeof data !== "object") return null;

  let questions = data.questions;
  if (!Array.isArray(questions)) return null;

  const sanitized = questions
    .filter(
      (q) =>
        q && typeof q.question === "string" && Array.isArray(q.options)
    )
    .map((q, index) => {
      const options = q.options;
      let correctAnswer = Number(q.correctAnswer);
      if (
        !Number.isInteger(correctAnswer) ||
        correctAnswer < 0 ||
        correctAnswer >= options.length
      ) {
        correctAnswer = 0;
      }
      return {
        question: q.question,
        options,
        correctAnswer,
        explanation: q.explanation || "",
      };
    });

  if (sanitized.length === 0) return null;

  return {
    title: data.title || `Quiz: ${data.topic || "Generated Quiz"}`,
    questions: sanitized,
  };
};

export const askAI = async (req, res, next) => {
  try {
    const { message, courseContext, lessonContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return res.json({
        reply: `This is a demo response. To get real AI responses, add your Mistral API key to server/.env.\n\nYour question: "${message}"\n\nTo get a Mistral API key, visit https://mistral.ai and create a free account.`,
      });
    }

    let systemPrompt =
      "You are LearnMind AI, a helpful educational assistant. You help students understand concepts, explain topics clearly, provide examples, and generate quiz questions. Be concise, clear, and encouraging. Format your responses with markdown when helpful.";

    if (courseContext) {
      systemPrompt += `\nThe student is currently studying: ${courseContext}`;
    }
    if (lessonContext) {
      systemPrompt += `\nThe current lesson is about: ${lessonContext}`;
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const detail =
        data?.error?.message || data?.message || `Mistral API error (${response.status})`;
      return res.status(502).json({ message: `AI service error: ${detail}` });
    }

    const content = extractTextContent(data?.choices?.[0]?.message?.content);
    if (!content) {
      return res
        .status(502)
        .json({ message: "AI service returned an empty response. Please try again." });
    }

    await Activity.create({
      user: req.user._id,
      type: "ai_chat",
      description: `Asked AI: "${message.slice(0, 50)}..."`,
    });

    res.json({ reply: content });
  } catch (error) {
    next(error);
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { topic, courseContext } = req.body;
    const apiKey = getApiKey();

    if (!apiKey) {
      return res.json({
        ...DEMO_QUIZ,
        fallback: true,
        note: "This is a demo quiz. Add your Mistral API key to server/.env for AI-generated quizzes.",
      });
    }

    const prompt = `Generate a quiz with 5 multiple choice questions about: ${topic || courseContext || "web development"}. Return ONLY valid JSON: {"title":"Quiz Title","questions":[{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]}`;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const detail =
        data?.error?.message || data?.message || `Mistral API error (${response.status})`;
      return res.json({
        ...DEMO_QUIZ,
        fallback: true,
        note: `Could not reach the AI service (${detail}). Showing a demo quiz instead.`,
      });
    }

    const content = extractTextContent(data?.choices?.[0]?.message?.content);
    const parsed = extractJson(content);
    const quiz = sanitizeQuiz(parsed);

    if (!quiz) {
      return res.json({
        ...DEMO_QUIZ,
        fallback: true,
        note: "The AI service returned an unreadable quiz. Showing a demo quiz instead.",
      });
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
};