import { createContext, useState, useEffect } from "react";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [documentReady, setDocumentReady] = useState(
    localStorage.getItem("documentReady") === "true"
  );

  const [documentName, setDocumentName] = useState(
    localStorage.getItem("documentName")
  );

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔹 Persist document state
  useEffect(() => {
    localStorage.setItem("documentReady", documentReady);
  }, [documentReady]);

  useEffect(() => {
    if (documentName) {
      localStorage.setItem("documentName", documentName);
    }
  }, [documentName]);

  // 🔹 Persist chat
  useEffect(() => {
    localStorage.setItem(
      "chatMessages",
      JSON.stringify(messages)
    );
  }, [messages]);

  return (
    <AppContext.Provider
      value={{
        documentReady,
        setDocumentReady,
        documentName,
        setDocumentName,
        messages,
        setMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
