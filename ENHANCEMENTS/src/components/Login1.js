import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login1.css";  // Ensure this is linked to your styles
import email_icon from "../components/assets/person.png";
import password_icon from "../components/assets/password.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginAndRegister = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);  // Toggling between SignUp and Login
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    admin_name: "",
    phone_number: "",
    admin_email: "",
    admin_profession: "therapist",
  });

  const [message, setMessage] = useState("");  // Success/Error Messages
  const [error, setError] = useState("");  // Error Message
  const [showPassword, setShowPassword] = useState(false);  // State to control password visibility

  const handleToggle = () => {
    setIsSignUp(!isSignUp);  // Toggle between login and sign up forms
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { username, password } = formData;
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/adminlogin`, { username, password });

      const { message, token, user, redirectTo } = response.data;
      setMessage(message);

      if (token) {
        console.log("Saving username to localStorage:", username);
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role); // Storing user role
        if (redirectTo) {
          navigate(redirectTo);
        }
      }

    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const { admin_name, phone_number, admin_email, admin_profession } = formData;
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        admin_name,
        phone_number,
        admin_email,
        admin_profession,
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
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type={showPassword ? "text" : "password"}  // Toggle password visibility
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
                >
                  <FontAwesomeIcon icon={showPassword ?  faEye:faEyeSlash} />
                </span>
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
                  name="admin_name"
                  value={formData.admin_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Email"
                  name="admin_email"
                  value={formData.admin_email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-field">
                <select
                  name="admin_profession"
                  value={formData.admin_profession}
                  onChange={handleInputChange}
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
