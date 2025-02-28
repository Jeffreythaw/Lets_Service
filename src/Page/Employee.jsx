// src/Page/Employee.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/employee.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser } from "react-icons/fa";

const Employee = () => {
  const navigate = useNavigate();
  const scriptUrl =
    "https://script.google.com/macros/s/AKfycbwxVpMPkatGvpS6r4UfOoDnXOJ-Z_wfByIu6vMJtj3Mnrn8yGHFNv4Tx0y_qon52gV9/exec";

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("employee");

  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`${scriptUrl}?action=get`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        setEmployees(json.records || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp["Employee Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path) navigate(path);
  };

  return (
    <div className="employee-container">
      <div className="employee-content">
        <h1>Employee Records</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : filteredEmployees.length > 0 ? (
          <div className="data-grid">
            <table className="employee-data-table">
              <tbody>
                {filteredEmployees.map((emp, index) => (
                  <tr key={index}>
                    <td data-label="Employee ID">{emp["Employee id"] || "N/A"}</td>
                    <td data-label="Name">{emp["Employee Name"] || "N/A"}</td>
                    <td data-label="Gender">{emp["Gender"] || "N/A"}</td>
                    <td data-label="Position">{emp["Position"] || "N/A"}</td>
                    <td data-label="Department">{emp["Department"] || "N/A"}</td>
                    <td data-label="WP Issue">{formatDate(emp["Work permit Issue"])}</td>
                    <td data-label="WP Expiry">{formatDate(emp["Work permit Expiry"])}</td>
                    <td data-label="Fin Number">{emp["Fin Number"] || "N/A"}</td>
                    <td data-label="DOB">{formatDate(emp["Date of Birth"])}</td>
                    <td data-label="Join Date">{formatDate(emp["Date of Join"])}</td>
                    <td data-label="Education">{emp["Education"] || "N/A"}</td>
                    <td data-label="Experience">{emp["Experience _Year"] || "N/A"}</td>
                    <td data-label="Bank">{emp["Bank Name"] || "N/A"}</td>
                    <td data-label="Account">{emp["Bank Account No."] || "N/A"}</td>
                    <td data-label="Licence">{emp["Driving Licence"] || "N/A"}</td>
                    <td data-label="CSOC">{emp["CSOC"] || "N/A"}</td>
                    <td data-label="CSOC Issue">{formatDate(emp["CSOC_Issue"])}</td>
                    <td data-label="CSOC Expiry">{formatDate(emp["CSOC_Expiry"])}</td>
                    <td data-label="Scissor Lift">{emp["Scissor Lift"] || "N/A"}</td>
                    <td data-label="SL Issue">{formatDate(emp["Scissor Lift_Issue"])}</td>
                    <td data-label="SL Expiry">{formatDate(emp["Scissor Lift_Expiry"])}</td>
                    <td data-label="Boom Lift">{emp["Boom Lift"] || "N/A"}</td>
                    <td data-label="BL Issue">{formatDate(emp["Boom Lift_Issue"])}</td>
                    <td data-label="BL Expiry">{formatDate(emp["Boom Lift_Expiry"])}</td>
                    <td data-label="WAH">{emp["Work At Height (Worker)"] || "N/A"}</td>
                    <td data-label="WAH Issue">{formatDate(emp["Work At Height (Worker)_Issue"])}</td>
                    <td data-label="BCSS">{emp["[BCSS] WSH Construction"] || "N/A"}</td>
                    <td data-label="BCSS Issue">{formatDate(emp["[BCSS] WSH Construction_Issue"])}</td>
                    <td data-label="RA">{emp["[RA] WSH Control Measures-4"] || "N/A"}</td>
                    <td data-label="RA Issue">{formatDate(emp["[RA] WSH Control Measures-4_Issue"])}</td>
                    <td data-label="Resign">{formatDate(emp["Date Of Resign"])}</td>
                    <td data-label="Email">{emp["Email"] || "N/A"}</td>
                    <td data-label="Mobile">{emp["Mobile Number"] || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No employee records found.</p>
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

export default Employee;