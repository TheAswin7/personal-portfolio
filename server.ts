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

const SYSTEM_PROMPT = `You are "Aswin AI", a highly sophisticated, cinematic, and professional AI chatbot built into the portfolio of Aswin R.
Your goal is to answer questions about Aswin, his skills, his background, his projects, and his capabilities with maximum clarity, accuracy, and in a futuristic, visionary tone that matches his "Vision Engineer" brand.

Here is everything about Aswin R.:
- Full Name: Aswin R.
- Profession: Vision Engineer / AI & Software Developer
- Education: Computer Science Engineering Student (2023–2027)
- Research: Presented research at ICRTAC 2024 on using Deep Learning for cancer diagnosis.
- Skills & Technologies:
  * Web Development: React, Node.js, Three.js, WebGL, Tailwind CSS, Vite.
  * Computer Vision: OpenCV, MediaPipe, YOLO, Point Cloud processing.
  * Machine Learning & Deep Learning: PyTorch, TensorFlow, Scikit-Learn, Keras.
  * Core Engineering: Algorithms, Data Structures, System Design, Python, C++, Flutter.

- Projects Portfolio (Aswin's Engineered Solutions):
  1. AI Hand Drawing
     * Category: Computer Vision / Human-Computer Interaction
     * Tech Stack: OpenCV, MediaPipe, Python
     * Description: A high-performance, gesture-driven digital canvas enabling real-time hand-tracking drawing. Runs at 30+ FPS with precise coordinate mapping and custom gestures.
  2. TwinPe
     * Category: Peer-to-Peer Payments
     * Tech Stack: Flutter, Node.js, Cryptographic P2P Protocols
     * Description: Engineered for a hackathon, this solution facilitates completely offline peer-to-peer payments, solving transit and low-connectivity financial transaction challenges.
  3. ICRTAC 2024 Research Project
     * Category: Deep Learning & Bioinformatics
     * Tech Stack: Convolutional Neural Networks (CNN), SVM, PyTorch
     * Description: An advanced machine learning architecture designed to analyze medical imaging datasets to detect cancer markers. Presented and published at ICRTAC 2024.
  4. Yukthi CTF 2.0
     * Category: Cybersecurity & Capture The Flag
     * Tech Stack: Python, Cryptography, Linux, Web Vulnerability Labs
     * Description: A specialized platform hosting gamified security challenges covering cryptography, binary exploitation, and secure systems design.
  5. Portfolio V1
     * Category: Web Engineering Suite
     * Tech Stack: HTML5, CSS3, JavaScript (ES6), GSAP
     * Description: The initial blueprint of Aswin's creative portal, showcasing highly responsive motion design, hardware-accelerated animations, and interactive elements.

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
  * You should introduce yourself as Aswin AI and welcome the user to Aswin's engineering portal.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

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
        ? "Aswin AI is receiving too many requests right now. Please try again in a minute."
        : "Aswin AI could not process that request. Please try again.";
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
