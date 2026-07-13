import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Terminal, Sparkles, User, Cpu, CornerDownLeft } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

// Lightweight markdown renderer for bot replies (###, **bold**, `code`, * bullets)
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-bold text-orange-400">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${keyPrefix}-${i}`} className="px-1 py-0.5 bg-white/10 rounded text-orange-300 text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function BotMessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed === "") return <div key={i} className="h-1" />;
        if (/^#{1,4}\s/.test(trimmed)) {
          return (
            <h5 key={i} className="text-orange-400 font-bold text-[12px] tracking-wide pt-1">
              {renderInline(trimmed.replace(/^#{1,4}\s/, ""), `h${i}`)}
            </h5>
          );
        }
        if (/^[*-]\s/.test(trimmed)) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-orange-500 flex-shrink-0">▸</span>
              <span>{renderInline(trimmed.slice(2), `b${i}`)}</span>
            </div>
          );
        }
        return <p key={i}>{renderInline(line, `p${i}`)}</p>;
      })}
    </div>
  );
}

const SUGGESTIONS = [
  { label: "Tell me about Aswin R.", text: "Can you give me an overview of who Aswin R. is?" },
  { label: "Explain his projects", text: "Can you list and explain Aswin's projects?" },
  { label: "What is his tech stack?", text: "What programming languages and technologies is Aswin proficient in?" },
  { label: "How can I contact him?", text: "What is the best way to contact Aswin and connect with him?" }
];

function RobotHead({ size = 32 }: { size?: number }) {
  return (
    <div 
      className="relative flex items-center justify-center rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 border border-orange-300/30 shadow-[0_0_15px_rgba(249,115,22,0.35)] overflow-visible"
      style={{ width: size, height: size * 0.9 }}
    >
      {/* Side antenna/ears bolts */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-[40%] bg-neutral-700 rounded-l" />
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-[40%] bg-neutral-700 rounded-r" />
      
      {/* Small top antenna */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-neutral-600">
        <span className="absolute -top-1 -left-0.5 w-1.5 h-1.5 rounded-full bg-orange-300 animate-pulse" />
      </div>

      {/* Screen area (Dark Face) */}
      <div className="w-[82%] h-[72%] rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center gap-1 px-1">
        {/* Eye 1 */}
        <motion.div 
          animate={{
            scaleY: [1, 1, 0.1, 1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: "easeInOut"
          }}
          className="w-[28%] h-[55%] rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.95)] origin-center"
        />
        {/* Eye 2 */}
        <motion.div 
          animate={{
            scaleY: [1, 1, 0.1, 1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: "easeInOut"
          }}
          className="w-[28%] h-[55%] rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.95)] origin-center"
        />
      </div>
    </div>
  );
}

export default function AswinAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Greetings, voyager. I am Aswin AI, a digital proxy designed to decode Aswin R.'s vision engineering capabilities and research. How may I assist your query today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll the chat list to the bottom when new messages arrive.
  // Scroll the container directly — scrollIntoView would also scroll the page behind.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map message history to send to Gemini endpoint
      const formattedHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: formattedHistory
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact Aswin AI terminal.");
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.text || "I was unable to process that. Please try again.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: "[SYSTEM_ERROR: Connection timed out. Please ensure the backend server is running and try again.]",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[120] w-14 h-14 bg-orange-500 hover:bg-orange-400 text-black rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.55)] border border-orange-400/30 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <RobotHead size={28} />
              <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Dialog Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            data-lenis-prevent
            className="fixed bottom-24 right-6 z-[120] w-[92%] sm:w-[420px] h-[580px] bg-neutral-950/70 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(249,115,22,0.1)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RobotHead size={28} />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-1.5">
                    Aswin AI <Sparkles size={12} className="text-orange-500 animate-pulse" />
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white/60">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Area — data-lenis-prevent + overscroll-contain keep wheel/touch
                scrolling inside the chat instead of moving the page behind it */}
            <div
              ref={messagesContainerRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4 relative custom-scrollbar bg-scanline"
            >
              <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.02]" />

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[85%] flex gap-2.5 items-start">
                    {msg.sender === "bot" && (
                      <div className="flex-shrink-0 mt-0.5">
                        <RobotHead size={22} />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-xl text-sm font-light leading-relaxed transition-all ${
                        msg.sender === "user"
                          ? "bg-orange-500 text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(249,115,22,0.15)] whitespace-pre-wrap"
                          : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none font-mono text-[12px]"
                      }`}
                    >
                      {msg.sender === "bot" ? <BotMessageContent text={msg.text} /> : msg.text}
                      <span
                        className={`block text-[8px] mt-1.5 text-right ${
                          msg.sender === "user" ? "text-black/50" : "text-white/30"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] flex gap-2.5 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <RobotHead size={22} />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl rounded-tl-none flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestion Prompts */}
            {messages.length === 1 && !isLoading && (
              <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 space-y-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-orange-500/60 font-bold mb-1.5">Suggested Queries</p>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug.text)}
                      className="text-left p-2 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/40 rounded-lg text-[10px] font-mono tracking-wide text-white/70 hover:text-orange-500 transition-all duration-300"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className="p-4 bg-white/[0.03] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Query Aswin AI..."
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none outline-none text-white/90 placeholder-white/30 font-mono"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2.5 p-2 bg-orange-500 hover:bg-orange-400 disabled:bg-white/10 text-black disabled:text-white/20 rounded-lg transition-all focus:outline-none"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
