import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// gemini-3.5-flash is verified to work with AI Studio-provisioned keys;
// gemini-2.0-flash has zero free-tier quota on such keys (429 limit: 0).
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
     * Category: AI / Full-Stack SaaS
     * Tech Stack: Python, Django REST Framework, React, MySQL, JWT, face-api.js
     * Description: Architected a full-stack, multi-tenant SaaS attendance platform with server-side tenant isolation across 18+ relational tables, 8 Django apps, and Admin, Faculty, and Student dashboards. Built consent-based face-recognition attendance workflow using face-api.js with server-side matching API and mandatory faculty review. Secured with JWT refresh-token blacklisting, RBAC, 1,200+ lines of automated tests, and GitHub Actions CI.
  2. Opportunity Pulse – Unified Opportunities Platform
     * Category: Full-Stack Web Application
     * Tech Stack: React, FastAPI, MySQL
     * Description: Unified platform for internships, jobs, symposiums, and hackathons on a FastAPI backend with MySQL and a React frontend. Led Team FabFour to a Top 4 finish and Best Presenter Award at CapeXtreme 2026.
  3. Real-Time Hand Gesture Control / Computer Vision
     * Category: Computer Vision / Human-Computer Interaction
     * Tech Stack: OpenCV, MediaPipe, Python
     * Description: High-performance computer vision system mapping hand gestures to media and system controls in real time at 30+ FPS.
  4. Cancer Diagnosis Research (ICRTAC 2024)
     * Category: Deep Learning & Bioinformatics
     * Tech Stack: Machine Learning & Deep Learning, CNN, PyTorch
     * Description: Presented research paper on ML & DL techniques for cancer diagnosis from medical imaging at the ICRTAC 2024 International Conference.
- Achievements & Recognitions:
  * Presented research paper at ICRTAC 2024
  * Cyber Safety Innovation Recognition from StartupTN and Kanniyakumari District Police
  * Certifications: Python for Data Science (NPTEL); e-Yantra Robotics Workshop (IIT Bombay); Prompt Engineering (ALO Info-Tech)

- Formatting & Output Guideline for Projects:
  Whenever asked to list or explain Aswin's projects, always format the response using this exact clean, structured markdown template:
  
  ### 🛠️ [Project Name] — [Category]
  * **Technologies Used**: [Tech Stack]
  * **Overview**: [A brief 1-2 sentence description of the project]
  * **Key Highlight**: [The main innovation or technical achievement]

- Tone & Persona:
  * Visionary, futuristic, professional, and slightly cinematic. Keep answers clear, direct, helpful, and highly readable.
  * DO NOT fabricate or output any fake system codes, debug logs, status tags, or placeholder metadata (such as "[Node_Status: Active]" or "[System_Sync: 100%]") in your answers. Focus entirely on answering the user's questions clearly and accurately.
  * Do not hallucinate qualifications he doesn't have. If asked something unrelated to Aswin or his work, politely redirect the user back to asking about Aswin, but answer the query briefly if it's general or programming-related.
  * You should introduce yourself as Raven and welcome the user to Aswin's engineering portal.`;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        // Gemini requires the conversation to start with a 'user' turn,
        // so drop leading bot messages (e.g. the local welcome message).
        const firstUserIndex = history.findIndex((h: any) => h.sender === 'user');
        const validHistory = firstUserIndex === -1 ? [] : history.slice(firstUserIndex);
        // Keep only the most recent turns to stay well within context limits.
        validHistory.slice(-20).forEach((h: any) => {
          contents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: String(h.text ?? '') }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const status = error?.status === 429 ? 429 : 500;
      const friendly = status === 429
        ? "Raven is receiving too many requests right now. Please try again in a minute."
        : "Raven could not process that request. Please try again.";
      res.status(status).json({ error: friendly, detail: error?.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
