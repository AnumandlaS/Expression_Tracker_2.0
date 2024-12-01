
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login1.css";  // Ensure this is linked to your styles
import email_icon from "../components/assets/person.png";
import password_icon from "../components/assets/password.png";

const LoginAndRegister = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);  // Toggling between SignUp and Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admin_name, setAdminName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [admin_email, setAdminEmail] = useState("");
  const [admin_role, setAdminRole] = useState("therapist");
  const [message, setMessage] = useState("");  // Success/Error Messages
  const [error, setError] = useState("");  // Error Message

  const handleToggle = () => {
    setIsSignUp(!isSignUp);  // Toggle between login and sign up forms
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/adminlogin", {
        username,
        password,
      });

      if (res.status === 200) {
        const { message, redirectTo, role } = res.data; 
        alert(message); // Show login message

        if (redirectTo) {
          navigate(redirectTo, { state: { username, role } });
        }
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        admin_name,
        phone_number,
        admin_email,
        admin_role,
      });

      if (response.data.success) {
        setMessage(response.data.message);  // Display success message
        setError("");  // Clear any errors
      } else {
        setError(response.data.message);  // Display error message
        setMessage("");  // Clear success message
      }
    } catch (error) {
      setMessage("");  // Clear success message
      setError(error.response?.data?.message || "Something went wrong");  // Display error message
    }
  };

  return (
    <div className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Login Form */}
          {!isSignUp && (
            <form onSubmit={handleLoginSubmit} className="sign-in-form">
              <h2 className="title">Login</h2>
              <div className="input-field">
                <img src={email_icon} alt="Email Icon" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <img src={password_icon} alt="Password Icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn">Login</button>
              <p>
                Don't have an account?{" "}
                <span onClick={handleToggle} style={{ cursor: "pointer" }}>
                  Register now
                </span>
              </p>
            </form>
          )}

          {/* Register Form */}
          {isSignUp && (
            <form onSubmit={handleRegisterSubmit} className="sign-up-form">
              <h2 className="title">Register</h2>
              {message && <div className="alert alert-success text-center">{message}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <h2 className="text-center mb-4">Admin Registration</h2>

              <div className="input-field">
                <input
                  type="text"
                  placeholder="Admin Name"
                  value={admin_name}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Email"
                  value={admin_email}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <select
                  value={admin_role}
                  onChange={(e) => setAdminRole(e.target.value)}
                  required
                >
                  <option value="therapist">Therapist</option>
                  <option value="game_developer">Game Developer</option>
                </select>
              </div>
              <button type="submit" className="btn">Register</button>
              <p>
                Already have an account?{" "}
                <span onClick={handleToggle} style={{ cursor: "pointer" }}>
                  Login here
                </span>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Optional Panels for switching effects */}
      <div className="panels-container">
        <div className={`panel ${isSignUp ? "panel-right" : "panel-left"}`} />
      </div>
    </div>
  );
};

export default LoginAndRegister;