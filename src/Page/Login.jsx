// src/Page/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeAnimation from "./WelcomeAnimation"; // Same folder
import "../css/login.css"; // Correct path
import { FaUserCircle, FaKey } from "react-icons/fa";
import ProgressButton from "../components/ProgressButton";

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 8000); // Matches WelcomeAnimation duration
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
    if (username === "admin" && password === "1234") {
      setIsLoggingIn(true);
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleComplete = () => {
    localStorage.setItem("authToken", "mocked-jwt-token");
    navigate("/dashboard");
  };

  return (
    <div className="login-wrapper">
      {!showLogin ? (
        <WelcomeAnimation onAnimationEnd={() => setShowLogin(true)} />
      ) : (
        <div className="login-container">
          <form
            className="loginForm"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <h1>Welcome Back</h1>
            <p>Enter your credentials to continue.</p>

            <div className="inputWrapper">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUserCircle className="icon" />
            </div>

            <div className="inputWrapper">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaKey className="icon" />
            </div>

            {!isLoggingIn ? (
              <button type="submit" className="submitButton">
                Sign In
              </button>
            ) : (
              <ProgressButton
                loadingTime={2000}
                onComplete={handleComplete}
                startProgressImmediately={true}
              />
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;