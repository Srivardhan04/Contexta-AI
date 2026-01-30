import { useState, useContext } from "react";
import { defineTerm } from "../services/api";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

export default function Terminology() {
  const { documentReady } = useContext(AppContext);

  const [term, setTerm] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!documentReady) {
      setError("Upload a document first.");
      return;
    }

    if (!term.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await defineTerm(term);
      setResult(res.definition || "No definition found.");
    } catch {
      setError("Failed to retrieve definition.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="glass-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="upload-panel collapsed" style={{ display: 'block' }}>
        <h2 className="section-title">Terminology Helper</h2>
        <p className="muted" style={{ margin: 0 }}>
          Search technical terms from the uploaded document
        </p>
      </div>

      <div className="chat-glass" style={{ padding: '2rem', display: 'block' }}>
      {/* 🔍 Search Bar */}
      <div className="term-search">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={
            documentReady
              ? "Enter a technical term (e.g. In-Context Learning)"
              : "Upload a document first"
          }
          disabled={!documentReady || loading}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button
          onClick={handleSearch}
          disabled={!documentReady || loading}
        >
          {loading ? "Searching…" : "Define"}
        </button>
      </div>

      {/* ❌ Error */}
      {error && <p className="error-text">{error}</p>}

      {/* ✅ Result */}
      {result && (
        <motion.div
          className="term-result"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {result}
        </motion.div>
      )}
      </div>
    </motion.div>
  );
}
