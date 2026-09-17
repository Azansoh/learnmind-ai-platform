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

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_PROVIDER_RETRIES = 2;
const PROVIDER_BREAK_MS = 5 * 60 * 1000;

const makeBody = (model, messages, isQuiz) => ({
  model,
  messages,
  temperature: 0.7,
  ...(isQuiz ? { response_format: { type: "json_object" } } : { max_tokens: 2000 }),
});

const PROVIDERS = [
  {
    name: "Groq",
    getKey: () => process.env.GROQ_API_KEY,
    placeholder: "your_groq_api_key_here",
    url: GROQ_URL,
    models: [
      "openai/gpt-oss-20b",
      "groq/compound",
      "groq/compound-mini",
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-120b",
    ],
  },
  {
    name: "Mistral",
    getKey: () => process.env.MISTRAL_API_KEY,
    placeholder: "your_mistral_api_key_here",
    url: MISTRAL_URL,
    models: ["mistral-small-latest"],
  },
];

const providerHealth = new Map();

const isProviderHealthy = (name) => {
  const health = providerHealth.get(name);
  if (!health || health.healthy) return true;
  return Date.now() - health.since >= health.pauseMs;
};

const markProviderFailure = (name) => {
  const health = providerHealth.get(name) || { failures: 0, healthy: true };
  health.failures = (health.failures || 0) + 1;
  if (health.failures >= 3) {
    health.healthy = false;
    health.since = Date.now();
    health.pauseMs = PROVIDER_BREAK_MS;
  }
  providerHealth.set(name, health);
};

const markProviderHealthy = (name) => {
  providerHealth.set(name, { failures: 0, healthy: true });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const questions = data.questions;
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

const rateLimitedMessage =
  "The AI service is temporarily busy. Please wait a few seconds and try again.";

const callProvider = async (provider, messages, isQuiz) => {
  const apiKey = provider.getKey();
  if (!apiKey || apiKey === provider.placeholder) {
    return { configured: false, provider };
  }

  let lastError = null;

  for (const model of provider.models) {
    let lastResponse = null;
    let lastData = null;

    for (let attempt = 0; attempt < MAX_PROVIDER_RETRIES; attempt++) {
      const response = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(makeBody(model, messages, isQuiz)),
      });

      lastResponse = response;
      lastData = await response.json().catch(() => null);

      if (response.status === 429 || response.status >= 500) {
        const retryAfterMs = parseInt(response.headers.get("retry-after") || "", 10);
        const delay = Math.min(
          Number.isFinite(retryAfterMs) && retryAfterMs > 0
            ? retryAfterMs * 1000
            : 500 * 2 ** attempt,
          3000
        );
        await sleep(delay);
        continue;
      }

      break;
    }

    if (!lastResponse) {
      lastError = { provider: provider.name, detail: "No response from AI service." };
      break;
    }

    if (lastResponse.ok) {
      return {
        configured: true,
        response: lastResponse,
        data: lastData,
        provider: provider.name,
        model,
      };
    }

    lastError = {
      provider: provider.name,
      status: lastResponse.status,
      detail:
        lastData?.error?.message ||
        lastData?.message ||
        `AI service error (${lastResponse.status})`,
    };

    if (lastResponse.status !== 404) break;
  }

  return { configured: true, error: lastError, provider: provider.name };
};

const chatWithFallback = async (messages, isQuiz = false) => {
  let lastError = null;

  for (const provider of PROVIDERS) {
    if (!isProviderHealthy(provider.name)) continue;

    const result = await callProvider(provider, messages, isQuiz);

    if (!result.configured) continue;

    if (result.response && result.response.ok) {
      const content = extractTextContent(
        result.data?.choices?.[0]?.message?.content
      );
      if (content) {
        markProviderHealthy(provider.name);
        return { ok: true, provider: result.provider, content };
      }
      lastError = {
        provider: result.provider,
        detail: "AI service returned an empty response.",
      };
      continue;
    }

    if (result.error?.status === 429) {
      markProviderFailure(provider.name);
    }

    lastError = result.error || {
      provider: result.provider,
      detail: "AI service is unavailable.",
    };
  }

  return { ok: false, lastError };
};

export const askAI = async (req, res, next) => {
  try {
    const { message, courseContext, lessonContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    let systemPrompt =
      "You are LearnMind AI, a helpful educational assistant. You help students understand concepts, explain topics clearly, provide examples, and generate quiz questions. Be concise, clear, and encouraging. Format your responses with markdown when helpful.";

    if (courseContext) {
      systemPrompt += `\nThe student is currently studying: ${courseContext}`;
    }
    if (lessonContext) {
      systemPrompt += `\nThe current lesson is about: ${lessonContext}`;
    }

    const result = await chatWithFallback([
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ]);

    if (result.ok) {
      await Activity.create({
        user: req.user._id,
        type: "ai_chat",
        description: `Asked AI (via ${result.provider}): "${message.slice(0, 50)}..."`,
      });
      return res.json({ reply: result.content });
    }

    let detail = result.lastError?.detail || "AI service is unavailable.";
    if (result.lastError?.status === 429) {
      return res.status(429).json({ message: rateLimitedMessage });
    }
    return res.status(502).json({ message: `AI service error: ${detail}` });
  } catch (error) {
    next(error);
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { topic, courseContext } = req.body;

    const prompt = `Generate a quiz with 5 multiple choice questions about: ${topic || courseContext || "web development"}. Return ONLY valid JSON: {"title":"Quiz Title","questions":[{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]}`;

    const result = await chatWithFallback(
      [{ role: "user", content: prompt }],
      true
    );

    if (result.ok) {
      const quiz = sanitizeQuiz(extractJson(result.content));
      if (quiz) {
        return res.json({ ...quiz, provider: result.provider });
      }
    }

    const fallbackNote =
      result.lastError?.status === 429
        ? "The AI service is temporarily busy. Showing a demo quiz instead. Please wait a few seconds and try again."
        : result.lastError
        ? `Could not reach the AI service. Showing a demo quiz instead.`
        : "No AI provider is configured. Showing a demo quiz instead.";

    const hasAnyProvider = PROVIDERS.some(
      (p) => p.getKey() && p.getKey() !== p.placeholder
    );

    return res.json({
      ...DEMO_QUIZ,
      fallback: true,
      note: hasAnyProvider
        ? fallbackNote
        : "No AI provider is configured. Showing a demo quiz instead. Add a Mistral or Groq API key to server/.env for AI-generated quizzes.",
    });
  } catch (error) {
    next(error);
  }
};