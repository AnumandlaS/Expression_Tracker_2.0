import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Analysis.css';

const Analysis = () => {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sessions');
      console.log("API Response:", response.data); // Log the response
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Session IDs</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Session Name</th>
            <th>Session ID</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => {
            // Parse the timestamp if it exists
            let date = 'N/A';
            let time = 'N/A';
            if (session.timestamp) {
              const timestamp = new Date(session.timestamp);
              date = timestamp.toLocaleDateString();
              time = timestamp.toLocaleTimeString();
            }

            return (
              <tr key={session.sessionId || index}>
                <td>{session.sessionName}</td>
                <td>
                  <Link to={`/analysis/${session.sessionId}`}>
                    {session.sessionId.slice(-4)} {/* Displaying last 4 digits */}
                  </Link>
                </td>
                <td>{date}</td>
                <td>{time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Analysis;
