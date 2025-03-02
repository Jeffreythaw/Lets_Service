// src/Page/LeaveApply.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/leave.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser, FaFolder, FaExclamationTriangle } from "react-icons/fa";

const LeaveApply = () => {
  const navigate = useNavigate();
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwxVpMPkatGvpS6r4UfOoDnXOJ-Z_wfByIu6vMJtj3Mnrn8yGHFNv4Tx0y_qon52gV9/exec";
  const employeeId = localStorage.getItem("username") || "admin";

  const [form, setForm] = useState({ type: "Sick", startDate: "", endDate: "", reason: "" });
  const [activeTab, setActiveTab] = useState("leave");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { action: "applyLeave", employeeId, ...form };
    try {
      await fetch(scriptUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(data) });
      alert("Leave application submitted!");
      setForm({ type: "Sick", startDate: "", endDate: "", reason: "" });
    } catch (error) {
      console.error("Leave apply error:", error);
      alert("Error submitting leave.");
    }
  };

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path) navigate(path);
  };

  return (
    <div className="leave-container">
      <div className="leave-header">
        <h1>Apply Leave</h1>
      </div>
      <div className="leave-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Sick">Sick</option>
              <option value="Vacation">Vacation</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Enter reason" required />
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>

      <div className="nav-bar">
        <label htmlFor="dashboard" className="nav-icon dashboard" onClick={() => handleNavigation("dashboard", "/dashboard")}>
          <FaHome className="icon" />
          <span className="nav-title">Dashboard</span>
        </label>
        <input type="radio" id="dashboard" name="nav" checked={activeTab === "dashboard"} />

        <label htmlFor="attendance" className="nav-icon attendance" onClick={() => handleNavigation("attendance", "/attendance")}>
          <FaClipboardList className="icon" />
          <span className="nav-title">Attendance</span>
        </label>
        <input type="radio" id="attendance" name="nav" checked={activeTab === "attendance"} />

        <label htmlFor="leave" className="nav-icon leave" onClick={() => handleNavigation("leave", "/leave-apply")}>
          <FaMoneyBillWave className="icon" />
          <span className="nav-title">Leave</span>
        </label>
        <input type="radio" id="leave" name="nav" checked={activeTab === "leave"} />

        <label htmlFor="projects" className="nav-icon projects" onClick={() => handleNavigation("projects", "/projects")}>
          <FaFolder className="icon" />
          <span className="nav-title">Projects</span>
        </label>
        <input type="radio" id="projects" name="nav" checked={activeTab === "projects"} />

        <label htmlFor="complaints" className="nav-icon complaints" onClick={() => handleNavigation("complaints", "/complaints")}>
          <FaExclamationTriangle className="icon" />
          <span className="nav-title">Complaints</span>
        </label>
        <input type="radio" id="complaints" name="nav" checked={activeTab === "complaints"} />

        <label htmlFor="employee" className="nav-icon employee" onClick={() => handleNavigation("employee", "/employee")}>
          <FaUser className="icon" />
          <span className="nav-title">Employee</span>
        </label>
        <input type="radio" id="employee" name="nav" checked={activeTab === "employee"} />

        <div className="nav-effect" />
      </div>
    </div>
  );
};

export default LeaveApply;