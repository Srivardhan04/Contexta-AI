import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Chat from "./pages/Chat";
import Insights from "./pages/Insights";
import Terminology from "./pages/Terminology";
import { AppProvider } from "./context/AppContext";

const globalStyles = `
  :root {
    --bg-dark: #0f1117;
    --bg-panel: #161b22;
    --primary: #3b82f6;
    --primary-hover: #2563eb;
    --text-main: #f3f4f6;
    --text-muted: #9ca3af;
    --border: #30363d;
    --glass-bg: rgba(22, 27, 34, 0.7);
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background-color: var(--bg-dark);
    color: var(--text-main);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #4b5563; }

  /* Layout */
  .app-shell { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .app-body { display: flex; flex: 1; overflow: hidden; }
  .workspace { flex: 1; padding: 0; overflow: hidden; position: relative; display: flex; flex-direction: column; }

  /* Glass Containers */
  .glass-container { flex: 1; display: flex; flex-direction: column; height: 100%; overflow: hidden; position: relative; }

  /* Navbar */
  .navbar {
    height: 64px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; border-bottom: 1px solid var(--border); background: var(--bg-panel); z-index: 10;
  }
  .brand { font-weight: 700; font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-main); }
  .nav-right { display: flex; align-items: center; gap: 1rem; }
  .doc-status {
    font-size: 0.85rem; color: var(--text-muted); background: rgba(255,255,255,0.03);
    padding: 0.35rem 0.75rem; border-radius: 6px; border: 1px solid var(--border);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .reset-btn {
    background: transparent; border: 1px solid var(--border); color: var(--text-muted);
    padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  }
  .reset-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }

  /* Sidebar */
  .sidebar-glass {
    width: 240px; display: flex; flex-direction: column; padding: 1rem; gap: 0.25rem;
    border-right: 1px solid var(--border); background: var(--bg-panel);
  }
  .nav-item {
    display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem;
    border-radius: 6px; color: var(--text-muted); text-decoration: none;
    font-size: 0.9rem; font-weight: 500; transition: all 0.2s;
  }
  .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text-main); }
  .nav-item.active { background: rgba(59, 130, 246, 0.1); color: var(--primary); }

  /* Chat Window */
  .chat-glass { display: flex; flex-direction: column; height: 100%; background: var(--bg-dark); }
  .chat-messages {
    flex: 1; padding: 2rem; overflow-y: auto; display: flex; flex-direction: column;
    gap: 1.5rem; max-width: 900px; width: 100%; margin: 0 auto;
  }
  .empty-state {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: var(--text-muted); text-align: center; opacity: 0.7;
  }
  .message-row { display: flex; width: 100%; }
  .message-row.user { justify-content: flex-end; }
  .message-row.ai { justify-content: flex-start; }
  .message-bubble {
    max-width: 85%; padding: 0.75rem 1rem; border-radius: 12px;
    line-height: 1.5; font-size: 0.95rem; position: relative;
  }
  .message-row.user .message-bubble {
    background: var(--primary); color: white; border-bottom-right-radius: 2px;
  }
  .message-row.ai .message-bubble {
    background: var(--bg-panel); border: 1px solid var(--border);
    color: var(--text-main); border-bottom-left-radius: 2px;
  }
  .chat-input {
    padding: 1.5rem; background: var(--bg-panel); border-top: 1px solid var(--border);
    display: flex; justify-content: center;
  }
  .input-wrapper {
    display: flex; gap: 0.5rem; background: var(--bg-dark); border: 1px solid var(--border);
    border-radius: 8px; padding: 0.35rem; width: 100%; max-width: 900px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-wrapper:focus-within {
    border-color: var(--primary); box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }
  .chat-input input {
    flex: 1; background: transparent; border: none; color: var(--text-main);
    padding: 0.5rem 0.75rem; font-size: 0.95rem; outline: none;
  }
  .chat-input button {
    background: var(--primary); color: white; border: none; padding: 0.5rem 1rem;
    border-radius: 6px; font-weight: 500; font-size: 0.9rem; cursor: pointer; transition: background 0.2s;
  }
  .chat-input button:hover:not(:disabled) { background: var(--primary-hover); }
  .chat-input button:disabled { background: var(--border); color: var(--text-muted); cursor: not-allowed; }

  /* Upload Panel */
  .upload-panel {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 4rem 2rem; border: 2px dashed var(--border); border-radius: 12px;
    background: rgba(255,255,255,0.01); margin: 2rem auto; max-width: 600px; text-align: center;
  }
  .upload-panel h2 { margin-top: 0; margin-bottom: 0.5rem; font-size: 1.5rem; color: var(--text-main); }
  .upload-panel .muted { color: var(--text-muted); margin-bottom: 2rem; }
  .upload-panel button {
    background: var(--primary); color: white; border: none; padding: 0.75rem 1.5rem;
    border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 1rem;
  }

  /* Terminology */
  .term-container { padding: 2rem; max-width: 800px; margin: 0 auto; width: 100%; }
  .section-title { font-size: 1.5rem; margin-bottom: 0.5rem; }
  .term-search { display: flex; gap: 0.75rem; margin: 2rem 0; }
  .term-search input {
    flex: 1; background: var(--bg-panel); border: 1px solid var(--border);
    padding: 0.75rem 1rem; border-radius: 8px; color: var(--text-main); outline: none; font-size: 1rem;
  }
  .term-search input:focus { border-color: var(--primary); }
  .term-search button {
    background: var(--primary); color: white; border: none; padding: 0 1.5rem;
    border-radius: 8px; font-weight: 600; cursor: pointer;
  }
  .term-result {
    background: var(--bg-panel); border: 1px solid var(--border); padding: 1.5rem;
    border-radius: 8px; line-height: 1.6; margin-top: 1rem;
  }
  .error-text { color: #ef4444; margin-top: 1rem; }
`;

export default function App() {
  return (
    <AppProvider>
      <style>{globalStyles}</style>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />

        <Route
          path="/chat"
          element={
            <Layout>
              <Chat />
            </Layout>
          }
        />

        <Route
          path="/insights"
          element={
            <Layout>
              <Insights />
            </Layout>
          }
        />

        <Route
          path="/terminology"
          element={
            <Layout>
              <Terminology />
            </Layout>
          }
        />
      </Routes>
    </AppProvider>
  );
}
