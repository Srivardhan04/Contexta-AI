import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-body">
        <Sidebar />
        <div className="workspace">{children}</div>
      </div>
    </div>
  );
}
