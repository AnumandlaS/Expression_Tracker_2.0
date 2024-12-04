import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/UpdatePassword.css";

const username = localStorage.getItem("username");
if (!username) {
  console.error("Username not found in localStorage.");
}
const admin_email = username || "";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObjID = async () => {
      try {
        if (!process.env.REACT_APP_BACKEND_URL) {
          console.error("Backend URL is not set. Check your .env file.");
          return;
        }

        console.log("Fetching Object ID for admin_email:", admin_email);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/getObjectID/${admin_email}`
        );
        console.log("Object ID response:", response.data);
        const objId = response.data.admin.id;
        localStorage.setItem("adminId", objId); // Save adminId for later use
      } catch (err) {
        console.error("Failed to fetch object ID:", err.message);
      }
    };

    if (admin_email) {
      fetchObjID();
    } else {
      console.error("Admin email is not defined.");
    }
  }, [admin_email]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(""); // Clear error if validation passes

    try {
      const adminId = localStorage.getItem("adminId");
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/updatePassword/${adminId}`,
        { password }
      );
      console.log("Password updated successfully:", response.data);
      alert("Password updated successfully!");
    } catch (err) {
      console.error("Failed to update password:", err.message);
      setError("Failed to update password.");
    }
  };

  const handleAnalysisClick = () => {
    navigate("/analysis", { state: { username } });
  };

  return (
    <div className="update">
      <div className="create-child-block">
        <h2>Update Password</h2>
        <form className="create-child-form" onSubmit={handleUpdatePassword}>
          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="create-btn1">
            Change Password
          </button>
        </form>
        <div className="home-container">
          <button className="home-button" onClick={handleAnalysisClick}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
