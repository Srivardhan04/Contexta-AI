import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { askQuestion } from "../services/api";
import { motion } from "framer-motion";

export default function Insights() {
  const { documentReady, documentName } = useContext(AppContext);
  
  // Cache insights per document to avoid re-fetching on navigation
  const [insights, setInsights] = useState(() => {
    const cached = localStorage.getItem(`insights_${documentName}`);
    return cached ? cached : null;
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (documentReady && !insights && !loading) {
      fetchInsights();
    }
  }, [documentReady, documentName]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // Prompting the existing chat backend for a structured summary
      const prompt = "Analyze this document. Provide a structured response with: 1. A concise Executive Summary. 2. Three Key Insights. 3. Three Strategic Takeaways. Format clearly.";
      const res = await askQuestion(prompt);
      
      if (res.answer) {
        setInsights(res.answer);
        localStorage.setItem(`insights_${documentName}`, res.answer);
      }
    } catch (error) {
      console.error("Failed to fetch insights", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="glass-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="upload-panel collapsed">
        <h2> Smart Insights</h2>
      </div>

      <div className="chat-glass" style={{ padding: '2rem', overflowY: 'auto' }}>
        {!documentReady ? (
          <div className="empty-state">
            <p>Please upload a document in the Chat tab to generate insights.</p>
          </div>
        ) : loading ? (
          <div className="definition-card">
            <h3>🔄 Analyzing Document...</h3>
            <p>Extracting key findings and summaries. This may take a moment.</p>
          </div>
        ) : (
          <div className="definition-card">
            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{insights}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
