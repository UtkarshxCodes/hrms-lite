import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">HRMS Lite</div>
        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Employees
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Attendance
          </NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </main>
    </div>
  );
}
