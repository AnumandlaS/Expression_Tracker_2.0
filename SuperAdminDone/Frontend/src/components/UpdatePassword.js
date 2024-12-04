import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UpdatePassword.css";

const username = localStorage.getItem("username");
if (!username) {
  console.error("Username not found in localStorage.");
}
const admin_email = username || "";

const UpdatePassword = () => {
  const [objId, setObjId] = useState(null); // State to store Object ID
  const [password, setPassword] = useState(""); // State to store new password
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Fetch Object ID
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
        setObjId(response.data.admin.id); // Save Object ID in state
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

  // Handle form submission
  const handleUpdatePassword = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (!password) {
      console.error("Password is required.");
      return;
    }

    if (!objId) {
      console.error("Object ID not found. Cannot update password.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/updatePassword/${objId}`,
        { password }
      );
      console.log("Password update response:", response.data);
      alert("Password updated successfully!");
    } catch (err) {
      console.error("Failed to update password:", err.message);
      alert("Error updating password.");
    }
  };

  return (
    <div className="update">
      <div className="create-child-block">
        <h2>Update Password</h2>
        <form className="create-child-form" onSubmit={handleUpdatePassword}>
          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "30px", flex: 1 }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  cursor: "pointer",
                  fontSize: "1.2em",
                  userSelect: "none",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>
          <button type="submit" className="create-btn">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
