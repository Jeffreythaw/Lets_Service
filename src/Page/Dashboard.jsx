// src/Page/Dashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const username = localStorage.getItem("username") || "Guest";

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path) navigate(path);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome, {username}!</p>

        {activeTab === "home" && (
          <div className="dashboard-info">
            <p>Manage your records from this mobile dashboard.</p>
            <button onClick={() => navigate("/expense-record")}>Add Expense</button>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="dashboard-info">
            <p>Redirecting to Expense Record...</p>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="dashboard-info">
            <h3>Attendance Management</h3>
            <button onClick={() => navigate("/attendance")}>Go to Attendance Page</button>
          </div>
        )}

        {activeTab === "employee" && (
          <div className="dashboard-info">
            <h3>Employee Management</h3>
            <button onClick={() => navigate("/employee")}>Go to Employee Page</button>
            <button onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button>
          </div>
        )}
      </div>

      <div className="nav-bar">
        <input type="radio" id="home" name="nav" checked={activeTab === "home"} />
        <label htmlFor="home" className="nav-icon home" onClick={() => handleNavigation("home", "/dashboard")}>
          <FaHome className="icon" />
          <span className="nav-title">Home</span>
        </label>

        <input type="radio" id="expenses" name="nav" checked={activeTab === "expenses"} />
        <label htmlFor="expenses" className="nav-icon expenses" onClick={() => handleNavigation("expenses", "/expense-record")}>
          <FaMoneyBillWave className="icon" />
          <span className="nav-title">Expenses</span>
        </label>

        <input type="radio" id="attendance" name="nav" checked={activeTab === "attendance"} />
        <label htmlFor="attendance" className="nav-icon attendance" onClick={() => handleNavigation("attendance", "/attendance")}>
          <FaClipboardList className="icon" />
          <span className="nav-title">Attendance</span>
        </label>

        <input type="radio" id="employee" name="nav" checked={activeTab === "employee"} />
        <label htmlFor="employee" className="nav-icon employee" onClick={() => handleNavigation("employee", "/employee")}>
          <FaUser className="icon" />
          <span className="nav-title">Employee</span>
        </label>

        <div className="nav-effect" />
      </div>
    </div>
  );
};

export default Dashboard;