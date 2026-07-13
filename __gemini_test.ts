import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } },
});

async function main() {
  // Same shape the fixed /api/chat sends: history sanitized to start with a user turn
  const contents = [
    { role: "user", parts: [{ text: "Who is Aswin?" }] },
    { role: "model", parts: [{ text: "Aswin R. is a vision engineer." }] },
    { role: "user", parts: [{ text: "Reply with exactly: PING OK" }] },
  ];
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    contents,
    config: { systemInstruction: "You are a test bot. Follow instructions exactly.", temperature: 0.7 },
  });
  console.log("MODEL RESPONSE:", response.text);

  // Reproduce the ORIGINAL bug: history starting with a model turn
  try {
    await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      contents: [
        { role: "model", parts: [{ text: "Greetings, voyager." }] },
        { role: "user", parts: [{ text: "hi" }] },
      ],
      config: { systemInstruction: "test", temperature: 0.7 },
    });
    console.log("MODEL-FIRST HISTORY: accepted (no error)");
  } catch (e: any) {
    console.log("MODEL-FIRST HISTORY ERROR:", e?.message || e);
  }
}

main().catch((e) => {
  console.error("LIST FAILED:", e?.message || e);
  process.exit(1);
});
