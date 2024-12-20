import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login1.css";  // Make sure to link the provided CSS
import email_icon from "../components/assets/person.png";
import password_icon from "../components/assets/password.png";

const LoginAndRegister = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);  // For toggling between sign in and sign up
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admin_name, setAdminName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [admin_email, setAdminEmail] = useState("");
  const [admin_role, setAdminRole] = useState("therapist");
  const [message, setMessage] = useState("");  // To display success or error messages
  const [error, setError] = useState("");  // To display error messages

  const handleToggle = () => {
    setIsSignUp(!isSignUp);  // Toggle between sign in and sign up mode
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login...");
    try {
      const res = await axios.post("http://localhost:5000/adminlogin", {
        username,
        password,
      });

      console.log("Response from server:", res.data);

      if (res.status === 200) {
        const { message, redirectTo, role } = res.data; // Extract role
        alert(message); // Show the login message
        
        // Navigate to the analysis page with username and role
        if (redirectTo) {
          navigate(redirectTo, { state: { username, role } });
        } else {
          console.log("Unexpected role or missing redirect path.");
        }
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please check the console for details.");
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
      setMessage(response.data.message);
      setError("");
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={`container ${isSignUp ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className={`sign-in-form ${isSignUp ? 'opacity-0' : ''}`}>
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

          {/* Register Form */}
          <form onSubmit={handleRegisterSubmit} className={`sign-up-form ${!isSignUp ? 'opacity-0' : ''}`}>
            <h2 className="title">Register</h2>
            {message && <div className="alert alert-success text-center">{message}</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
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
        </div>
      </div>

      {/* Panels for Switching */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New Here?</h3>
            <p>Register now to get started with the game!</p>
            <button className="btn transparent" onClick={handleToggle}>
              Register
            </button>
          </div>
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Already have an account?</h3>
            <p>Login to continue your session!</p>
            <button className="btn transparent" onClick={handleToggle}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAndRegister;
