import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const {
    documentReady,
    documentName,
    setDocumentReady,
    setDocumentName,
    setMessages,
  } = useContext(AppContext);

  const resetSession = () => {
    setDocumentReady(false);
    setDocumentName(null);
    setMessages([]);

    localStorage.clear();
  };

  return (
    <div className="navbar">
      <div className="brand">
        <span></span> Contexta AI
      </div>

      <div className="nav-right">
        <div className="doc-status">
          {documentReady
            ? ` ${documentName}`
            : "No document loaded"}
        </div>

        {documentReady && (
          <button
            className="reset-btn"
            onClick={resetSession}
          >
            New Document
          </button>
        )}
      </div>
    </div>
  );
}
