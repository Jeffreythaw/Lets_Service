// src/Page/Attendance.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/attendance.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser } from "react-icons/fa";

const Attendance = () => {
  const navigate = useNavigate();
  const scriptUrl =
    "https://script.google.com/macros/s/AKfycbwxVpMPkatGvpS6r4UfOoDnXOJ-Z_wfByIu6vMJtj3Mnrn8yGHFNv4Tx0y_qon52gV9/exec"; // Replace with your actual script ID

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("attendance");

  // Format date to DD-MMM-YYYY
  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        setLoading(true);
        const response = await fetch(`${scriptUrl}?action=getAttendance`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const json = await response.json();
        setAttendanceRecords(json.records || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendanceData();
  }, []);

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path) navigate(path);
  };

  return (
    <div className="attendance-container">
      <div className="attendance-content">
        <h1>Attendance Records</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : attendanceRecords.length > 0 ? (
          <div className="data-grid">
            <table className="attendance-data-table">
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td data-label="Date">{formatDate(record["Date"])}</td>
                    <td data-label="Employee">{record["Employee Name"] || "N/A"}</td>
                    <td data-label="Time In">{record["Time In"] || "N/A"}</td>
                    <td data-label="Time Out">{record["Time Out"] || "N/A"}</td>
                    <td data-label="Project">{record["Project"] || "N/A"}</td>
                    <td data-label="Total Hours">{record["Total Hours"] || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No attendance records found.</p>
        )}
      </div>

      {/* Navigation Bar */}
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

export default Attendance;