// src/Page/ComplaintRecord.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/complaint.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser, FaFolder, FaExclamationTriangle } from "react-icons/fa";

const ComplaintRecord = () => {
  const navigate = useNavigate();
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwxVpMPkatGvpS6r4UfOoDnXOJ-Z_wfByIu6vMJtj3Mnrn8yGHFNv4Tx0y_qon52gV9/exec";
  const employeeId = localStorage.getItem("username") || "admin";

  const [form, setForm] = useState({ project: "", description: "", photo: null });
  const [activeTab, setActiveTab] = useState("complaints");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("action", "addComplaint");
    formData.append("employeeId", employeeId);
    formData.append("project", form.project);
    formData.append("description", form.description);
    if (form.photo) formData.append("photo", form.photo);

    try {
      await fetch(scriptUrl, { method: "POST", body: formData });
      alert("Complaint recorded!");
      setForm({ project: "", description: "", photo: null });
    } catch (error) {
      console.error("Complaint error:", error);
      alert("Error recording complaint.");
    }
  };

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path) navigate(path);
  };

  return (
    <div className="complaint-container">
      <div className="complaint-header">
        <h1>Complaint Record</h1>
      </div>
      <div className="complaint-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project</label>
            <input type="text" name="project" value={form.project} onChange={handleChange} placeholder="Enter project name" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the complaint" required />
          </div>
          <div className="form-group">
            <label>Photo</label>
            <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit">Submit Complaint</button>
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

export default ComplaintRecord;