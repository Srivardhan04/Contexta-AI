import { useState, useContext, useRef, useEffect } from "react";
import { askQuestion } from "../services/api";
import MessageBubble from "./MessageBubble";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

export default function ChatWindow() {
  // 🔹 GLOBAL STATE (persists across routes)
  const { documentReady, messages, setMessages } =
    useContext(AppContext);

  // 🔹 LOCAL UI STATE
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Typing animation ref (prevents overlap / leaks)
  const typingIntervalRef = useRef(null);

  // 🔹 Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // 🔹 Typing animation logic
  const typeAnswer = (fullText) => {
    let index = 0;
    let currentText = "";

    // Clear any previous typing
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (index >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        return;
      }

      currentText += fullText[index];
      index++;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          text: currentText,
        };
        return updated;
      });
    }, 18); // typing speed
  };

  // 🔹 Send message
  const sendMessage = async () => {
    if (!documentReady || !input.trim() || loading) return;

    const userMessage = { role: "user", text: input };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await askQuestion(input);
      const fullAnswer =
        response.answer || "No answer returned.";

      // Insert empty AI bubble
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "" },
      ]);

      // Start typing animation
      typeAnswer(fullAnswer);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Error getting answer from backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="chat-glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* ================= MESSAGES ================= */}
      <div className="chat-messages">
        {!documentReady && (
          <div className="empty-state">
            <h3>👋 Welcome to Contexta AI</h3>
            <p>Upload a PDF document to begin analyzing and chatting.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            text={msg.text}
          />
        ))}

        {loading && (
          <motion.div
            className="message-row ai"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="message-bubble typing">
              Thinking…
            </div>
          </motion.div>
        )}
      </div>

      {/* ================= INPUT ================= */}
      <div className="chat-input">
        <div className="input-wrapper">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              documentReady
                ? "Ask anything about the document..."
                : "Waiting for document upload..."
            }
            disabled={!documentReady || loading}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          <button
            onClick={sendMessage}
            disabled={!documentReady || loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
}
