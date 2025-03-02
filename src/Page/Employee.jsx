// src/Page/Employee.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/employee.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser, FaFolder, FaExclamationTriangle } from "react-icons/fa";

const Employee = () => {
  const navigate = useNavigate();
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwxVpMPkatGvpS6r4UfOoDnXOJ-Z_wfByIu6vMJtj3Mnrn8yGHFNv4Tx0y_qon52gV9/exec";
  const role = localStorage.getItem("role");
  //const user = localStorage.getItem("username") || "admin"; // Assuming user from login

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("employee");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [form, setForm] = useState({
    "Employee id": "",
    "Employee Name": "",
    "Gender": "",
    "Position": "",
    "Department": "",
    "Work permit Issue": "",
    "Work permit Expiry": "",
    "Fin Number": "",
    "Date of Birth": "",
    "Date of Join": "",
    "Education": "",
    "Experience _Year": "",
    "Bank Name": "",
    "Bank Account No.": "",
    "Driving Licence": "",
    "CSOC": "",
    "CSOC_Issue": "",
    "CSOC_Expiry": "",
    "Scissor Lift": "",
    "Scissor Lift_Issue": "",
    "Scissor Lift_Expiry": "",
    "Boom Lift": "",
    "Boom Lift_Issue": "",
    "Boom Lift_Expiry": "",
    "Work At Height (Worker)": "",
    "Work At Height (Worker)_Issue": "",
    "[BCSS] WSH Construction": "",
    "[BCSS] WSH Construction_Issue": "",
    "[RA] WSH Control Measures-4": "",
    "[RA] WSH Control Measures-4_Issue": "",
    "Date Of Resign": "",
    "Email": "",
    "Mobile Number": "",
    "remarks": "",
    "timestamp": ""
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const data = {
      action: "addEmployee",
      ...form,
      "user": user,
      "timestamp": new Date().toISOString()
    };
    try {
      console.log("Adding employee:", JSON.stringify(data));
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      setEmployees((prev) => [...prev, data]);
      resetForm();
      alert("Employee added successfully!");
    } catch (error) {
      console.error("Add employee error:", error.message);
      alert(`Error adding employee: ${error.message}`);
    }
  };

  const handleEditEmployee = (emp) => {
    if (role === "admin") { // Only admin can edit
      setEditingEmployee(emp);
      setForm(emp);
      setShowForm(true);
    } else {
      alert("Employees cannot edit records.");
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    const data = {
      action: "updateEmployee",
      ...form,
      "user": user,
      "timestamp": new Date().toISOString()
    };
    try {
      console.log("Updating employee:", JSON.stringify(data));
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      setEmployees((prev) => prev.map(emp => emp["Employee id"] === form["Employee id"] ? data : emp));
      resetForm();
      alert("Employee updated successfully!");
    } catch (error) {
      console.error("Update employee error:", error.message);
      alert(`Error updating employee: ${error.message}`);
    }
  };

  const resetForm = () => {
    setForm({
      "Employee id": "",
      "Employee Name": "",
      "Gender": "",
      "Position": "",
      "Department": "",
      "Work permit Issue": "",
      "Work permit Expiry": "",
      "Fin Number": "",
      "Date of Birth": "",
      "Date of Join": "",
      "Education": "",
      "Experience _Year": "",
      "Bank Name": "",
      "Bank Account No.": "",
      "Driving Licence": "",
      "CSOC": "",
      "CSOC_Issue": "",
      "CSOC_Expiry": "",
      "Scissor Lift": "",
      "Scissor Lift_Issue": "",
      "Scissor Lift_Expiry": "",
      "Boom Lift": "",
      "Boom Lift_Issue": "",
      "Boom Lift_Expiry": "",
      "Work At Height (Worker)": "",
      "Work At Height (Worker)_Issue": "",
      "[BCSS] WSH Construction": "",
      "[BCSS] WSH Construction_Issue": "",
      "[RA] WSH Control Measures-4": "",
      "[RA] WSH Control Measures-4_Issue": "",
      "Date Of Resign": "",
      "Email": "",
      "Mobile Number": "",
      "remarks": "",
      "timestamp": ""
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp["Employee Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path) navigate(path);
  };

  return (
    <div className="employee-container">
      {/* ... existing header ... */}
      <div className="employee-content">
        {!showForm ? (
          <>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {role === "admin" && ( // Only admin can add
                <button onClick={() => setShowForm(true)}>Add New Employee</button>
              )}
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
                      <tr key={index} onClick={() => handleEditEmployee(emp)}>
                        <td data-label="ID">{emp["Employee id"] || "N/A"}</td>
                        <td data-label="Name">{emp["Employee Name"] || "N/A"}</td>
                        <td data-label="Position">{emp["Position"] || "N/A"}</td>
                        <td data-label="Dept">{emp["Department"] || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No employee records found.</p>
            )}
          </>
        ) : (
          <div className="form-container">
            <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    name="Employee id"
                    value={form["Employee id"]}
                    onChange={handleChange}
                    required
                    disabled={!!editingEmployee} // Disable ID editing
                  />
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="Employee Name" value={form["Employee Name"]} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="Gender" value={form["Gender"]} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input type="text" name="Position" value={form["Position"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="Department" value={form["Department"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Work Permit Issue</label>
                  <input type="date" name="Work permit Issue" value={form["Work permit Issue"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Work Permit Expiry</label>
                  <input type="date" name="Work permit Expiry" value={form["Work permit Expiry"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fin Number</label>
                  <input type="text" name="Fin Number" value={form["Fin Number"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="Date of Birth" value={form["Date of Birth"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Date of Join</label>
                  <input type="date" name="Date of Join" value={form["Date of Join"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Education</label>
                  <input type="text" name="Education" value={form["Education"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input type="number" name="Experience _Year" value={form["Experience _Year"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input type="text" name="Bank Name" value={form["Bank Name"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bank Account No.</label>
                  <input type="text" name="Bank Account No." value={form["Bank Account No."]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Driving Licence</label>
                  <input type="text" name="Driving Licence" value={form["Driving Licence"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>CSOC</label>
                  <input type="text" name="CSOC" value={form["CSOC"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>CSOC Issue</label>
                  <input type="date" name="CSOC_Issue" value={form["CSOC_Issue"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>CSOC Expiry</label>
                  <input type="date" name="CSOC_Expiry" value={form["CSOC_Expiry"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Scissor Lift</label>
                  <input type="text" name="Scissor Lift" value={form["Scissor Lift"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Scissor Lift Issue</label>
                  <input type="date" name="Scissor Lift_Issue" value={form["Scissor Lift_Issue"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Scissor Lift Expiry</label>
                  <input type="date" name="Scissor Lift_Expiry" value={form["Scissor Lift_Expiry"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Boom Lift</label>
                  <input type="text" name="Boom Lift" value={form["Boom Lift"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Boom Lift Issue</label>
                  <input type="date" name="Boom Lift_Issue" value={form["Boom Lift_Issue"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Boom Lift Expiry</label>
                  <input type="date" name="Boom Lift_Expiry" value={form["Boom Lift_Expiry"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Work At Height</label>
                  <input type="text" name="Work At Height (Worker)" value={form["Work At Height (Worker)"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Work At Height Issue</label>
                  <input type="date" name="Work At Height (Worker)_Issue" value={form["Work At Height (Worker)_Issue"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>BCSS WSH Construction</label>
                  <input type="text" name="[BCSS] WSH Construction" value={form["[BCSS] WSH Construction"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>BCSS WSH Construction Issue</label>
                  <input type="date" name="[BCSS] WSH Construction_Issue" value={form["[BCSS] WSH Construction_Issue"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>RA WSH Control Measures</label>
                  <input type="text" name="[RA] WSH Control Measures-4" value={form["[RA] WSH Control Measures-4"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>RA WSH Control Measures Issue</label>
                  <input type="date" name="[RA] WSH Control Measures-4_Issue" value={form["[RA] WSH Control Measures-4_Issue"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Date of Resign</label>
                  <input type="date" name="Date Of Resign" value={form["Date Of Resign"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="Email" value={form["Email"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="text" name="Mobile Number" value={form["Mobile Number"]} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea name="remarks" value={form["remarks"]} onChange={handleChange} placeholder="Enter remarks" />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit">{editingEmployee ? "Update Employee" : "Add Employee"}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
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

export default Employee;