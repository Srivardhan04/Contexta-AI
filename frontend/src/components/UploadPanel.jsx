import { useState, useContext } from "react";
import { uploadPDF } from "../services/api";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

export default function UploadPanel() {
  const { documentReady, documentName, setDocumentReady, setDocumentName } = useContext(AppContext);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Uploading and processing document…");

      const response = await uploadPDF(file);

      // ✅ GLOBAL STATE UPDATE (KEY FIX)
      setDocumentReady(true);
      setDocumentName(file.name);

      setStatus(response.message || "PDF processed successfully.");
    } catch (error) {
      console.error(error);
      setStatus("Upload failed. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 COLLAPSED VIEW (When document is ready)
  if (documentReady) {
    return (
      <motion.div
        className="upload-panel collapsed"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>📄</span>
          <span style={{ fontWeight: "600", color: "#e5e7eb" }}>{documentName}</span>
          <span style={{ fontSize: "12px", color: "#34d399", background: "rgba(52, 211, 153, 0.1)", padding: "2px 8px", borderRadius: "4px" }}>Active</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="upload-panel"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="upload-content">
        <h2>Document Context</h2>
        <p className="muted">
          Upload a research paper (PDF) to start chatting with AI
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Upload & Process"}
        </button>
      </div>

      {status && <p className="status">{status}</p>}
    </motion.div>
  );
}
