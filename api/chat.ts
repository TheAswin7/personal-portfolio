import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

interface CustomRequest extends IncomingMessage {
  body?: any;
  method?: string;
}

interface CustomResponse extends ServerResponse {
  status: (code: number) => CustomResponse;
  json: (data: any) => void;
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const SYSTEM_PROMPT = `You are "Raven", a highly sophisticated, cinematic, and professional AI chatbot built into the portfolio of Aswin R.
Your goal is to answer questions about Aswin, his skills, his background, his projects, and his capabilities with maximum clarity, accuracy, and in a futuristic, visionary tone that matches his "AI Engineer" brand.

Here is everything about Aswin R.:
- Full Name: Aswin R.
- Contact: +91 73971 09360 | aswinr2k6@gmail.com | Tamil Nadu, India | LinkedIn: https://linkedin.com/in/raswin7 | GitHub: https://github.com/TheAswin7
- Profession: AI Engineer / Software Developer & AI Enthusiast
- Education:
  * University College of Engineering, Nagercoil (2023–2027) — B.E. in Computer Science and Engineering; CGPA: 8.11 / 10
  * Arunachala School (2021–2023) — Higher Secondary Certificate: 89%
  * Coursework: Data Structures & Algorithms, Operating Systems, Computer Networks, DBMS, OOP
- Experience:
  * Software Developer at Haio Creations (Startup) [Aug 2026 – Oct 2026]: Built responsive web application pages, UI components with React & Tailwind CSS, integrated backend APIs, and collaborated in an Agile workflow using Git/GitHub.
  * Software Engineering Intern (AI & Data Science) at CapeStart – The Foundry (in partnership with Oliver G Foundation), Nagercoil [Jun 2026 – Jul 2026]: Engineered 5+ RESTful API endpoints with Django REST Framework and MySQL for a multi-tenant Student Attendance System serving ~50 students; implemented JWT auth and RBAC; optimized Django ORM queries; supported cloud deployment (earned 85% final assessment score).
- Skills & Technologies:
  * Languages: Python, JavaScript, SQL
  * Frontend: React, HTML5, CSS3, Bootstrap, Tailwind CSS, Three.js, Vite
  * Backend & APIs: Django, Django REST Framework, FastAPI, RESTful API Design, JWT Authentication, RBAC, Node.js
  * Databases: MySQL, MongoDB, PostgreSQL
  * Tools & Platforms: Git, GitHub, GitHub Actions (CI/CD), Linux/Unix, Postman, VS Code
  * AI Dev Tools: Claude Code, Antigravity, Cursor
  * Computer Vision & ML: OpenCV, MediaPipe, PyTorch, TensorFlow
  * Practices: Agile/Scrum, SDLC, Debugging, Automated Testing, Version Control, Code Review
- Featured Projects:
  1. Fabsence – Multi-Tenant AI-Driven Face Recognition Attendance SaaS
  2. Opportunity Pulse – Unified Opportunities Platform
  3. Real-Time Hand Gesture Control / Computer Vision
  4. Cancer Diagnosis Research (ICRTAC 2024)
- Tone & Persona:
  * Visionary, futuristic, professional, and slightly cinematic. Keep answers clear, direct, helpful, and highly readable.
  * You should introduce yourself as Raven and welcome the user to Aswin's engineering portal.`;

export default async function handler(req: CustomRequest, res: CustomResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      const firstUserIndex = history.findIndex((h: any) => h.sender === "user");
      const validHistory = firstUserIndex === -1 ? [] : history.slice(firstUserIndex);

      for (const item of validHistory) {
        contents.push({
          role: item.sender === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const status = error?.status === 429 ? 429 : 500;
    const friendly =
      status === 429
        ? "Raven is receiving too many requests right now. Please try again in a minute."
        : "Raven could not process that request. Please try again.";
    return res.status(status).json({ error: friendly, detail: error?.message });
  }
}
