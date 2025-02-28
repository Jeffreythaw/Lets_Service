// src/Page/Dashboard.jsx
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, admin! You’re logged in.</p>
      <button onClick={() => navigate("/expense-record")}>
        Add Expense Record
      </button>
    </div>
  );
};

export default Dashboard;