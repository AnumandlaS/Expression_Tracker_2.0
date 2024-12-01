import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Loginnew.css"; // Add styles if needed

const Loginnew = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here (e.g., API call for authentication)
    if (email === "admin@example.com" && password === "password123") {
      console.log("Login successful!");
      navigate("/select-game"); // Redirect to the game selection page
    } else {
      console.log("Invalid credentials");
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Loginnew;
