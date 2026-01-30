import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar-glass">
      <NavLink to="/chat" className="nav-item">
        <span></span> Chat
      </NavLink>

      <NavLink to="/insights" className="nav-item">
        <span></span> Insights
      </NavLink>

      <NavLink to="/terminology" className="nav-item">
        <span></span> Terminology
      </NavLink>
    </div>
  );
}
