// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Page/Login";
import Dashboard from "./Page/Dashboard";
import Employee from "./Page/Employee";
import Attendance from "./Page/Attendance";
import LeaveApply from "./Page/LeaveApply";
import Project from "./Page/Project";
import ComplaintRecord from "./Page/ComplaintRecord";
import "./App.css";

const ProtectedRoute = ({ children, adminOnly }) => {
  const role = localStorage.getItem("role");
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (adminOnly && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/employee" 
            element={<ProtectedRoute adminOnly><Employee /></ProtectedRoute>} 
          />
          <Route 
            path="/attendance" 
            element={<ProtectedRoute><Attendance /></ProtectedRoute>} 
          />
          <Route 
            path="/leave-apply" 
            element={<ProtectedRoute><LeaveApply /></ProtectedRoute>} 
          />
          <Route 
            path="/projects" 
            element={<ProtectedRoute adminOnly><Project /></ProtectedRoute>} 
          />
          <Route 
            path="/complaints" 
            element={<ProtectedRoute><ComplaintRecord /></ProtectedRoute>} 
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;