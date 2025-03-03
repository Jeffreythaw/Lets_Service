// src/Page/Attendance.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/attendance.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser, FaFolder, FaExclamationTriangle } from "react-icons/fa";

const Attendance = () => {
  const navigate = useNavigate();
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwsPouQh0skupfD8HNzqGKnoCBAnJF-17WqC0kUmh-PQnG0-sBwV9Sm5GoDVMA1XNdl/exec"; // Updated URL
  const projectScriptUrl = "https://script.google.com/macros/s/AKfycbw76MUyfn1O6eaJmDK15O5Zqf7qL8Q0XMb25D3A_JEQGm6H3sQo9EGSoxNTBiC6J2KT/exec?action=getProjects";
  const employeeName = localStorage.getItem("username") || "admin";
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    project: "",
    timeIn: "",
    timeOut: "",
    comments: ""
  });
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("attendance");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(projectScriptUrl);
        if (!response.ok) throw new Error(`Fetch projects failed: ${response.status}`);
        const json = await response.json();
        console.log("Fetched projects:", json.projects);
        setProjects(json.projects || []);
      } catch (error) {
        console.error("Fetch projects error:", error.message);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // In Attendance.jsx
  const handleClockIn = async () => {
    const timeIn = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const data = {
      action: "clockIn",
      Date: form.date,
      ProjectIn: form.project,
      TimeIn: timeIn,
      remarks: form.comments || "",
      user: employeeName
    };

    try {
      console.log("Clock in data:", data);
      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      setForm((prev) => ({ ...prev, timeIn }));
      alert("Clocked in successfully!");
    } catch (error) {
      console.error("Clock in error:", error);
      alert(`Error clocking in: ${error.message}`);
    }
  };

  const handleClockOut = async () => {
    const timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const data = {
      action: "clockOut",
      Date: form.date,
      ProjectOut: form.project,
      TimeOut: timeOut,
      remarks: form.comments || "",
      user: employeeName
    };

    try {
      console.log("Clock out data:", data);
      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      setForm((prev) => ({ ...prev, timeOut }));
      alert("Clocked out successfully!");
    } catch (error) {
      console.error("Clock out error:", error);
      alert(`Error clocking out: ${error.message}`);
    }
  };

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path && (role === "admin" || ["attendance", "leave-apply", "complaints"].includes(path.split("/")[1]))) {
      navigate(path);
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const randomColor = () => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Attendance</h1>
      </div>
      <div className="attendance-content">
        <div className="attendance-info">
          <p className="username" style={{ color: randomColor() }}>{employeeName}</p>
          <p className="date">{currentDate}</p>
          <p className="time">{currentTime}</p>
          <div className="form-group">
            <label>Project</label>
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              className="project-dropdown"
            >
              <option value="">Select Project</option>
              {projects.map((project, index) => (
                <option key={index} value={project}>{project}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button
              onClick={handleClockIn}
              disabled={form.timeIn || !form.project}
              className="clock-in-button"
            >
              Clock In
            </button>
            <button
              onClick={handleClockOut}
              disabled={!form.timeIn || form.timeOut || !form.project}
              className="clock-out-button"
            >
              Clock Out
            </button>
          </div>
          <div className="form-group">
            <label>Comments</label>
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              placeholder="Enter comments"
              className="comments-textbox"
            />
          </div>
        </div>
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