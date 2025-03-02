// src/Page/Project.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/project.css";
import { FaHome, FaMoneyBillWave, FaClipboardList, FaUser, FaFolder, FaExclamationTriangle } from "react-icons/fa";

const Project = () => {
  const navigate = useNavigate();
  const scriptUrl = "https://script.google.com/macros/s/AKfycbw76MUyfn1O6eaJmDK15O5Zqf7qL8Q0XMb25D3A_JEQGm6H3sQo9EGSoxNTBiC6J2KT/exec";
  const user = localStorage.getItem("username") || "admin";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    "Projectcode": "",
    "ProjectName": "",
    "Address": "",
    "NatureOfContract": "",
    "StartDate": "",
    "EndDate": "",
    "FirstPICcontactNo": "",
    "SecondPICcontactNo": "",
    "BillingAddress": "",
    "BillingEmail": "",
    "PaymentTerm": "",
    "remarks": ""
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch(`${scriptUrl}?action=getProjects`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        setProjects(json.records || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const data = { 
      action: "addProject", 
      ...form, 
      "user": user 
    };
    try {
      console.log("Adding project:", JSON.stringify(data));
      await fetch(scriptUrl, { 
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      setProjects((prev) => [...prev, { ...data, "timestamp": new Date().toISOString() }]);
      resetForm();
      alert("Project added successfully!");
    } catch (error) {
      console.error("Add project error:", error.message);
      alert(`Error adding project: ${error.message}`);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const data = { 
      action: "updateProject", 
      ...form, 
      "user": user 
    };
    try {
      console.log("Updating project:", JSON.stringify(data));
      await fetch(scriptUrl, { 
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      setProjects((prev) => prev.map(p => p["Projectcode"] === form["Projectcode"] ? { ...data, "timestamp": new Date().toISOString() } : p));
      resetForm();
      alert("Project updated successfully!");
    } catch (error) {
      console.error("Update project error:", error.message);
      alert(`Error updating project: ${error.message}`);
    }
  };

  const resetForm = () => {
    setForm({ 
      "Projectcode": "", 
      "ProjectName": "", 
      "Address": "", 
      "NatureOfContract": "", 
      "StartDate": "", 
      "EndDate": "", 
      "FirstPICcontactNo": "", 
      "SecondPICcontactNo": "", 
      "BillingAddress": "", 
      "BillingEmail": "", 
      "PaymentTerm": "", 
      "remarks": "" 
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setForm(project);
    setShowForm(true);
  };

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    if (path) navigate(path);
  };

  return (
    <div className="project-container">
      <div className="project-header">
        <h1>Project List</h1>
      </div>
      <div className="project-content">
        {!showForm ? (
          <>
            <div className="control-container">
              <button onClick={() => setShowForm(true)}>Add New Project</button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : projects.length > 0 ? (
              <div className="data-grid">
                <table className="project-data-table">
                  <tbody>
                    {projects.map((project, index) => (
                      <tr key={index} onClick={() => handleEditProject(project)}>
                        <td data-label="Code">{project["Projectcode"] || "N/A"}</td>
                        <td data-label="Name">{project["ProjectName"] || "N/A"}</td>
                        <td data-label="Address">{project["Address"] || "N/A"}</td>
                        <td data-label="Nature">{project["NatureOfContract"] || "N/A"}</td>
                        <td data-label="Start">{project["StartDate"] || "N/A"}</td>
                        <td data-label="End">{project["EndDate"] || "N/A"}</td>
                        <td data-label="PIC1">{project["FirstPICcontactNo"] || "N/A"}</td>
                        <td data-label="PIC2">{project["SecondPICcontactNo"] || "N/A"}</td>
                        <td data-label="Bill Addr">{project["BillingAddress"] || "N/A"}</td>
                        <td data-label="Bill Email">{project["BillingEmail"] || "N/A"}</td>
                        <td data-label="Pay Term">{project["PaymentTerm"] || "N/A"}</td>
                        <td data-label="Remarks">{project["remarks"] || "N/A"}</td>
                        <td data-label="Time">{project["timestamp"] || "N/A"}</td>
                        <td data-label="User">{project["user"] || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No projects found.</p>
            )}
          </>
        ) : (
          <div className="form-container">
            <form onSubmit={editingProject ? handleUpdateProject : handleAddProject}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Project Code</label>
                  <input
                    type="text"
                    name="Projectcode"
                    value={form["Projectcode"]}
                    onChange={handleChange}
                    placeholder="Enter project code"
                    required
                    disabled={!!editingProject} // Prevent changing Projectcode when editing
                  />
                </div>
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="ProjectName"
                    value={form["ProjectName"]}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="Address"
                    value={form["Address"]}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label>Nature of Contract</label>
                  <input
                    type="text"
                    name="NatureOfContract"
                    value={form["NatureOfContract"]}
                    onChange={handleChange}
                    placeholder="Enter nature of contract"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="StartDate"
                    value={form["StartDate"]}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="EndDate"
                    value={form["EndDate"]}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>First PIC Contact No</label>
                  <input
                    type="text"
                    name="FirstPICcontactNo"
                    value={form["FirstPICcontactNo"]}
                    onChange={handleChange}
                    placeholder="Enter first PIC contact"
                  />
                </div>
                <div className="form-group">
                  <label>Second PIC Contact No</label>
                  <input
                    type="text"
                    name="SecondPICcontactNo"
                    value={form["SecondPICcontactNo"]}
                    onChange={handleChange}
                    placeholder="Enter second PIC contact"
                  />
                </div>
                <div className="form-group">
                  <label>Billing Address</label>
                  <input
                    type="text"
                    name="BillingAddress"
                    value={form["BillingAddress"]}
                    onChange={handleChange}
                    placeholder="Enter billing address"
                  />
                </div>
                <div className="form-group">
                  <label>Billing Email</label>
                  <input
                    type="email"
                    name="BillingEmail"
                    value={form["BillingEmail"]}
                    onChange={handleChange}
                    placeholder="Enter billing email"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Term</label>
                  <input
                    type="text"
                    name="PaymentTerm"
                    value={form["PaymentTerm"]}
                    onChange={handleChange}
                    placeholder="Enter payment term"
                  />
                </div>
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={form["remarks"]}
                    onChange={handleChange}
                    placeholder="Enter remarks"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit">{editingProject ? "Update Project" : "Add Project"}</button>
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

export default Project;