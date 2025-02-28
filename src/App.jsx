// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Page/Login";
import Dashboard from "./Page/Dashboard";
import ExpenseRecord from "./Page/ExpenseRecord";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expense-record" element={<ExpenseRecord />} />
          <Route path="/attendance" element={<div>Attendance Page (TBD)</div>} />
          <Route path="/employee" element={<div>Employee Page (TBD)</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;