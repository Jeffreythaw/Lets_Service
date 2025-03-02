// src/Page/Attendance.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/attendance.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser, FaFolder, FaExclamationTriangle } from "react-icons/fa";

const Attendance = () => {
  const navigate = useNavigate();
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwxVpMPkatGvpS6r4UfOoDnXOJ-Z_wfByIu6vMJtj3Mnrn8yGHFNv4Tx0y_qon52gV9/exec"; // Same as employee's script
  const employeeName = localStorage.getItem("username") || "admin";
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({ 
    date: new Date().toISOString().split("T")[0], 
    projectIn: "", 
    timeIn: "", 
    timeOut: "" 
  });
  const [activeTab, setActiveTab] = useState("attendance");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClockIn = async () => {
    const data = { 
      action: "clockIn", 
      "Date": form.date, 
      "ProjectIn": form.projectIn, 
      "TimeIn": new Date().toLocaleTimeString(), 
      "user": employeeName 
    };
    try {
      console.log("Clock in data:", JSON.stringify(data));
      await fetch(scriptUrl, { 
        method: "POST", 
        mode: "no-cors", 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      setForm((prev) => ({ ...prev, timeIn: data["TimeIn"] }));
      alert("Clocked in successfully!");
    } catch (error) {
      console.error("Clock in error:", error.message);
      alert("Error clocking in.");
    }
  };

  const handleClockOut = async () => {
    const data = { 
      action: "clockOut", 
      "Date": form.date, 
      "ProjectOut": form.projectIn, 
      "TimeOut": new Date().toLocaleTimeString(), 
      "user": employeeName 
    };
    try {
      console.log("Clock out data:", JSON.stringify(data));
      await fetch(scriptUrl, { 
        method: "POST", 
        mode: "no-cors", 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      setForm((prev) => ({ ...prev, timeOut: data["TimeOut"] }));
      alert("Clocked out successfully!");
    } catch (error) {
      console.error("Clock out error:", error.message);
      alert("Error clocking out.");
    }
  };

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path && (role === "admin" || ["attendance", "leave-apply", "complaints"].includes(path.split("/")[1]))) {
      navigate(path);
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Attendance</h1>
      </div>
      <div className="attendance-content">
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Project</label>
          <input 
            type="text" 
            name="projectIn" 
            value={form.projectIn} 
            onChange={handleChange} 
            placeholder="Enter project name" 
          />
        </div>
        <div className="form-actions">
          <button onClick={handleClockIn} disabled={form.timeIn}>Clock In</button>
          <button onClick={handleClockOut} disabled={!form.timeIn || form.timeOut}>Clock Out</button>
        </div>
        {form.timeIn && <p>Time In: {form.timeIn}</p>}
        {form.timeOut && <p>Time Out: {form.timeOut}</p>}
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

        {role === "admin" && (
          <>
            <label htmlFor="projects" className="nav-icon projects" onClick={() => handleNavigation("projects", "/projects")}>
              <FaFolder className="icon" />
              <span className="nav-title">Projects</span>
            </label>
            <input type="radio" id="projects" name="nav" checked={activeTab === "projects"} />
          </>
        )}

        <label htmlFor="complaints" className="nav-icon complaints" onClick={() => handleNavigation("complaints", "/complaints")}>
          <FaExclamationTriangle className="icon" />
          <span className="nav-title">Complaints</span>
        </label>
        <input type="radio" id="complaints" name="nav" checked={activeTab === "complaints"} />

        {role === "admin" && (
          <>
            <label htmlFor="employee" className="nav-icon employee" onClick={() => handleNavigation("employee", "/employee")}>
              <FaUser className="icon" />
              <span className="nav-title">Employee</span>
            </label>
            <input type="radio" id="employee" name="nav" checked={activeTab === "employee"} />
          </>
        )}

        <div className="nav-effect" />
      </div>
    </div>
  );
};

export default Attendance;