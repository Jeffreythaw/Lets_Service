// src/Page/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser, FaFolder, FaExclamationTriangle, FaSignOutAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [attendanceData, setAttendanceData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwxVpMPkatGvpS6r4UfOoDnXOJ-Z_wfByIu6vMJtj3Mnrn8yGHFNv4Tx0y_qon52gV9/exec";
  const employeeName = localStorage.getItem("username") || "admin";
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, complaintRes] = await Promise.all([
          fetch(`${scriptUrl}?action=getAttendance`),
          fetch(`${scriptUrl}?action=getComplaints`),
        ]);
        if (!attendanceRes.ok || !complaintRes.ok) throw new Error("Fetch failed");
        const attendanceJson = await attendanceRes.json();
        const complaintJson = await complaintRes.json();

        const attendanceChart = attendanceJson.records
          ?.filter(r => r["user"] === employeeName)
          .map(r => ({ date: r["Date"], hours: parseFloat(r["TotalTime"]) || 0 }));
        const complaintChart = complaintJson.records
          ?.reduce((acc, r) => {
            acc[r["Project"]] = (acc[r["Project"]] || 0) + 1;
            return acc;
          }, {});

        setAttendanceData(attendanceChart || []);
        setComplaintData(Object.entries(complaintChart || {}).map(([project, count]) => ({ project, count })));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };
    fetchData();
  }, [employeeName]);

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path && (role === "admin" || ["attendance", "leave-apply", "complaints"].includes(path.split("/")[1]))) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { state: { fromLogout: true } }); // Pass fromLogout flag
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome, {employeeName}!</p>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <h2>Attendance Hours</h2>
          <BarChart width={300} height={150} data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Bar dataKey="hours" fill="#5628ee" />
          </BarChart>
        </div>

        <div className="chart-section">
          <h2>Complaints by Project</h2>
          <BarChart width={300} height={150} data={complaintData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="project" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Bar dataKey="count" fill="#ff4444" />
          </BarChart>
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

export default Dashboard;