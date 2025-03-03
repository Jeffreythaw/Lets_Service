// src/Page/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/login.css";
import { FaUserCircle, FaLock, FaEnvelope, FaKey } from "react-icons/fa";
import ProgressButton from "../components/ProgressButton";
import WelcomeAnimation from "./WelcomeAnimation";

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [users, setUsers] = useState([]);
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Start false for faster initial render

  const navigate = useNavigate();
  const location = useLocation();
  const loginScriptUrl = "https://script.google.com/macros/s/AKfycbyYE_huQhK1kYXukdTRr0YV-GzQeMm_gOSYAdmTEblkwCGyNHpk-c49pbqIItUax1cp/exec";
  const employeeScriptUrl = "https://script.google.com/macros/s/AKfycbwxVpMPkatGvpS6r4UfOoDnXOJ-Z_wfByIu6vMJtj3Mnrn8yGHFNv4Tx0y_qon52gV9/exec?action=getEmails";
  const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes cache timeout

  const encryptPassword = (plainPassword) => window.btoa(plainPassword);
  const decryptPassword = (encryptedPassword) => window.atob(encryptedPassword);

  const fetchUsers = async (force = false) => {
    const cached = JSON.parse(localStorage.getItem("cachedUsers") || "{}");
    const now = Date.now();
    if (!force && cached.data && (now - cached.timestamp < CACHE_TIMEOUT)) {
      console.log("Using cached users");
      setUsers(cached.data);
      return;
    }

    const startTime = performance.now();
    try {
      const response = await fetch(`${loginScriptUrl}?action=get`);
      if (!response.ok) throw new Error(`Fetch users failed: ${response.status} ${response.statusText}`);
      const json = await response.json();
      console.log("Fetched users:", json.records);
      setUsers(json.records || []);
      localStorage.setItem("cachedUsers", JSON.stringify({ data: json.records || [], timestamp: now }));
      console.log(`fetchUsers took ${(performance.now() - startTime) / 1000} seconds`);
    } catch (error) {
      console.error("Fetch users error:", error.message);
      setError(`Failed to load users: ${error.message}`);
    }
  };

  const fetchEmployeeEmails = async (force = false) => {
    const cached = JSON.parse(localStorage.getItem("cachedEmployeeEmails") || "{}");
    const now = Date.now();
    if (!force && cached.data && (now - cached.timestamp < CACHE_TIMEOUT)) {
      console.log("Using cached employee emails");
      setEmployeeEmails(cached.data);
      return;
    }

    const startTime = performance.now();
    try {
      const response = await fetch(employeeScriptUrl);
      if (!response.ok) throw new Error(`Fetch employee emails failed: ${response.status} ${response.statusText}`);
      const json = await response.json();
      console.log("Fetched employee emails:", json.emails);
      setEmployeeEmails(json.emails || []);
      localStorage.setItem("cachedEmployeeEmails", JSON.stringify({ data: json.emails || [], timestamp: now }));
      console.log(`fetchEmployeeEmails took ${(performance.now() - startTime) / 1000} seconds`);
    } catch (error) {
      console.error("Fetch employee emails error:", error.message);
      setError(`Failed to load employee emails: ${error.message}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchEmployeeEmails()]);
      setIsLoading(false);
      const delay = location.state?.fromLogout ? 0 : 8000; // No delay after logout
      if (delay > 0) {
        const timer = setTimeout(() => setShowLogin(true), delay);
        return () => clearTimeout(timer);
      } else {
        setShowLogin(true); // Immediate render after logout
      }
    };
    loadData();
  }, [location.state]);

  const handleLogin = () => {
    if (!username || !password) {
      setMessage("Please enter both Employee Name and Password.");
      return;
    }

    console.log("Attempting login with:", { username, password });
    const user = users.find(u => {
      const storedName = u["Employee Name"]?.toLowerCase().trim();
      const inputName = username.toLowerCase().trim();
      const storedPass = u["Password"] ? decryptPassword(u["Password"]) : "";
      const inputPass = password.trim();
      console.log("Comparing:", { storedName, inputName, storedPass, inputPass });
      return storedName === inputName && storedPass === inputPass;
    });

    if (user) {
      setIsProcessing(true);
      localStorage.setItem("username", user["Employee Name"]);
      localStorage.setItem("role", user["Role"] || "employee");
      console.log("Assigned role:", user["Role"] || "employee");
      setTimeout(() => {
        localStorage.setItem("authToken", "mocked-jwt-token");
        navigate("/dashboard");
      }, 1000); // Reduced from 2000ms
    } else {
      console.log("Login failed. Users:", users);
      setMessage("Invalid Employee Name or Password.");
    }
  };

  const handleRegister = async () => {
    if (!username || !password || !email) {
      setMessage("Please enter Employee Name, Password, and Email.");
      return;
    }

    const emailApproved = employeeEmails.some(empEmail => empEmail.toLowerCase().trim() === email.toLowerCase().trim());
    if (!emailApproved) {
      setMessage("Registration rejected: Email not found in employee records.");
      return;
    }

    const encryptedPassword = encryptPassword(password);
    const data = {
      action: "register",
      "Employee Name": username,
      "Email": email,
      "Password": encryptedPassword,
      "Employee ID": `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      "Role": "employee",
      "Timestamp": new Date().toISOString()
    };

    try {
      setIsProcessing(true);
      console.log("Registering:", JSON.stringify(data));
      const response = await fetch(loginScriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      console.log("Register response (no-cors, no data):", response);
      setMessage("Registration successful! Please log in.");
      setTimeout(async () => {
        await fetchUsers(true); // Force refresh after registration
        toggleMode("login");
      }, 1000); // Reduced from 2000ms
    } catch (error) {
      console.error("Registration error:", error.message);
      setError("Registration failed: " + error.message);
      setIsProcessing(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your Email.");
      return;
    }

    const data = {
      action: "resetPassword",
      "Email": email
    };

    try {
      setIsProcessing(true);
      console.log("Requesting reset:", JSON.stringify(data));
      await fetch(loginScriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      setMessage("A reset token has been sent to your email. Please check your inbox.");
      setTimeout(() => toggleMode("reset"), 1000); // Reduced from 2000ms
    } catch (error) {
      console.error("Reset error:", error.message);
      setError(`Error requesting reset: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !password) {
      setMessage("Please enter Reset Token and New Password.");
      return;
    }

    const encryptedPassword = encryptPassword(password);
    const data = {
      action: "updatePassword",
      "Reset Token": resetToken,
      "Password": encryptedPassword
    };

    try {
      setIsProcessing(true);
      console.log("Resetting password:", JSON.stringify(data));
      await fetch(loginScriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      setMessage("Password reset successful! Please log in.");
      setTimeout(async () => {
        await fetchUsers(true); // Force refresh after reset
        toggleMode("login");
      }, 1000); // Reduced from 2000ms
    } catch (error) {
      console.error("Reset error:", error.message);
      setError(`Error resetting password: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    setUsername("");
    setPassword("");
    setEmail("");
    setResetToken("");
    setMessage(null);
    setError(null);
    setIsProcessing(false);
  };

  if (isLoading) return <div className="login-loading">Loading...</div>;
  if (error && !users.length && !employeeEmails.length) return <div className="login-error">Error: {error}</div>;

  return (
    <div className="login-wrapper">
      {!showLogin ? (
        <WelcomeAnimation />
      ) : (
        <div className="login-container">
          <div className="login-box">
            <h1 className="login-title">
              {mode === "login" ? "Employee Login" : mode === "register" ? "Register Account" : mode === "forgot" ? "Forgot Password" : "Reset Password"}
            </h1>
            <p className="login-subtitle">
              {mode === "login" ? "Sign in to access your dashboard" : 
               mode === "register" ? "Create a new employee account" : 
               mode === "forgot" ? "Enter your email to reset password" : 
               "Enter token and new password"}
            </p>

            {mode !== "forgot" && mode !== "reset" && (
              <div className="input-group">
                <FaUserCircle className="input-icon" />
                <input
                  type="text"
                  placeholder="Employee Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            )}

            {(mode === "login" || mode === "register" || mode === "reset") && (
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder={mode === "reset" ? "New Password" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            )}

            {(mode === "register" || mode === "forgot") && (
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            )}

            {mode === "reset" && (
              <div className="input-group">
                <FaKey className="input-icon" />
                <input
                  type="text"
                  placeholder="Reset Token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            )}

            <div className="login-actions">
              {!isProcessing ? (
                <button
                  type="button"
                  onClick={() => {
                    if (mode === "login") handleLogin();
                    else if (mode === "register") handleRegister();
                    else if (mode === "forgot") handleForgotPassword();
                    else handleResetPassword();
                  }}
                  className="login-button"
                >
                  {mode === "login" ? "Sign In" : mode === "register" ? "Register" : mode === "forgot" ? "Request Reset" : "Reset Password"}
                </button>
              ) : (
                <ProgressButton
                  loadingTime={1000} // Reduced from 2000ms
                  onComplete={() => setIsProcessing(false)}
                  startProgressImmediately={true}
                />
              )}

              {mode === "login" && (
                <>
                  <button type="button" onClick={() => toggleMode("register")} className="toggle-button">
                    Register New Account
                  </button>
                  <button type="button" onClick={() => toggleMode("forgot")} className="toggle-button">
                    Forgot Password?
                  </button>
                </>
              )}
              {mode === "register" && (
                <button type="button" onClick={() => toggleMode("login")} className="toggle-button">
                  Already Registered? Login
                </button>
              )}
              {mode === "forgot" && (
                <button type="button" onClick={() => toggleMode("login")} className="toggle-button">
                  Back to Login
                </button>
              )}
              {mode === "reset" && (
                <button type="button" onClick={() => toggleMode("login")} className="toggle-button">
                  Back to Login
                </button>
              )}
            </div>

            {message && <p className="login-message">{message}</p>}
            {error && <p className="login-error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;