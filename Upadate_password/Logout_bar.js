import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/logout_bar.css";
import { Link } from "react-router-dom";

const NavBar = ({ username, profilePicture, handleLogout, role }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleMouseEnter = () => setShowDropdown(true);
    const handleMouseLeave = () => setShowDropdown(false);

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light fixed-top"
            style={{
                backgroundColor: "rgba(173, 216, 230, 0.8)", // Background color
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
                padding: "0.5rem 1rem", // Reduce padding
                height: "60px", // Set a fixed height
            }}
        >
            <div className="container-fluid">
                {/* Brand */}
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <img
                        src="favicon.ico"
                        alt="Favicon"
                        style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "10px",
                            borderRadius: "50%",
                            border: "2px solid #fff", // Add a subtle border
                        }}
                    />
                    <b style={{ fontSize: "1.5rem", color: "#2ea8b1" }}>
                        EXPRESSION TRACKER
                    </b>
                </a>

                {/* Toggle Button for Mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {/* Add other nav items here if needed */}
                    </ul>

                    {/* User Dropdown Menu */}
                    <div
                        className="user-dropdown ms-auto" // Move it to the right with ms-auto
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            position: "relative",
                            display: "inline-block",
                            cursor: "pointer",
                        }}
                    >
                        {/* User Icon */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "5px",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: "bold",
                                    color: "#2ea8b1",
                                }}
                            >
                                {username || "User"}
                            </span>
                        </div>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div
                                className="dropdown-menu show"
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: "0",
                                    backgroundColor: "#fff",
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    borderRadius: "8px",
                                    zIndex: 1000,
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    className="text-center dropdown-header"
                                    style={{
                                        padding: "10px 15px",
                                        fontSize: "1rem",
                                    }}
                                >
                                    Welcome, <strong>{username || "User"}</strong>
                                    <br />
                                    <small style={{ color: "#6c757d" }}>
                                        {role === "admin" ? "Admin" : "Child"}
                                    </small>
                                </div>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="/profile">
                                    Profile
                                </a>
                                {role === "admin" && (
                               

                                   <Link
                                       className="dropdown-item"
                                       to={{
                                           pathname: "/analysis/manage-accounts",
                                           state: { username: username },
                                       }}
                                   >
                                       Manage Child Accounts
                                   </Link>
                                   
                               
                                )}
                                 {role === "admin" && (
                               

                               <Link
                                   className="dropdown-item"
                                   to={{
                                       pathname: "/analysis/update-password",
                                       state: { username: username },
                                   }}
                               >
                                   Change Password
                               </Link>
                               
                           
                            )}
                                <a
                                    className="dropdown-item"
                                    href="#logout"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Define PropTypes for validation
NavBar.propTypes = {
    username: PropTypes.string,
    profilePicture: PropTypes.string, // Optional: URL of the user's profile picture
    handleLogout: PropTypes.func.isRequired,
    role: PropTypes.oneOf(["admin", "child"]).isRequired, // Role should be either "admin" or "child"
};

export default NavBar;
