import Activity from "../models/activity.js";

export const askAI = async (req, res, next) => {
  try {
    const { message, courseContext, lessonContext } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey || apiKey === "your_mistral_api_key_here") {
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

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      await Activity.create({
        user: req.user._id,
        type: "ai_chat",
        description: `Asked AI: "${message.slice(0, 50)}..."`,
      });
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ message: "AI service error" });
    }
  } catch (error) {
    next(error);
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { topic, courseContext } = req.body;
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey || apiKey === "your_mistral_api_key_here") {
      return res.json({
        title: `Quiz: ${topic || courseContext || "General Knowledge"}`,
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

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const quiz = JSON.parse(cleaned);
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};
