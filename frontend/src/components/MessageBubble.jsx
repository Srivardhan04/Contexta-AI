import { motion } from "framer-motion";

export default function MessageBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <motion.div
      className={`message-row ${isUser ? "user" : "ai"}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="message-bubble">{text}</div>
    </motion.div>
  );
}
