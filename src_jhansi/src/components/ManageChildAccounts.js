import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageChildAccounts.css";
import {useLocation,useNavigate } from "react-router-dom";
import Navbar from './Logout_bar';
const ManageChildAccounts = () => {

  const username = localStorage.getItem("username");
  console.log("Username : "+username);
  const [childAccounts, setChildAccounts] = useState([]);
  const [newChild, setNewChild] = useState({ name: "", age: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch child accounts
  useEffect(() => {
    const fetchChildAccounts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/verified/${username}`);
        setChildAccounts(response.data.children_accounts || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch child accounts.");
        setLoading(false);
      }
    };
    fetchChildAccounts();
  }, []);

  // Handle form changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewChild((prev) => ({ ...prev, [id]: value }));
  };

  // Create a new child account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!newChild.name || !newChild.age || !newChild.password) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/add-child/${username}`, newChild);
      setChildAccounts(response.data); // Update the child accounts list
      setNewChild({ name: "", age: "", password: "" }); // Reset form
    } catch (err) {
      setError("Failed to create child account.");
    }
  };
  const handleLogout = () => {
    console.log(`${username} logged out.`);
    navigate("/", { state: { username } }); // Redirect to the home or login page
  };

  // Render
  return (
    
    <div className="manage-child-accounts">
      <Navbar username={username} handleLogout={handleLogout} role="admin" />
      <div className="create-child-block">
        <h2>Create New Child Account</h2>
        <form className="create-child-form" onSubmit={handleCreateAccount}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={newChild.name}
              onChange={handleInputChange}
              placeholder="Enter child name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              value={newChild.age}
              onChange={handleInputChange}
              placeholder="Enter child age"
              min="1"
              max="18"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={newChild.password}
              onChange={handleInputChange}
              placeholder="Enter child password"
            />
          </div>
          <button type="submit" className="create-btn">
            Create Account
          </button>
        </form>
      </div>

      <div className="child-accounts-block">
        <h2>Existing Child Accounts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : childAccounts.length > 0 ? (
          <ul>
            {childAccounts.map((child, index) => (
              <li key={index} className="child-account">
                <span>
                  <strong>Name:</strong> {child.name} | <strong>Age:</strong>{" "}
                  {child.age}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No child accounts available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageChildAccounts;
