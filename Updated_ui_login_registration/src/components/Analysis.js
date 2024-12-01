import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Analysis.css';
import Navbar from './Logout_bar';

const formatDateTime = (timestamp) => {
  try {
    if (!timestamp || !Array.isArray(timestamp) || timestamp.length !== 2) {
      console.log('Invalid timestamp:', timestamp);
      return { date: 'N/A', time: 'N/A' };
    }

    const [dateStr, timeStr] = timestamp;
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return {
      date: formattedDate || 'N/A',
      time: timeStr || 'N/A',
    };
  } catch (error) {
    console.error('Error formatting date/time:', error);
    return { date: 'N/A', time: 'N/A' };
  }
};

const Analysis = () => {
  const [sessions, setSessions] = useState([]);
  const [existingAnalysis, setExistingAnalysis] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSessionId, setLoadingSessionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      console.log('Fetching sessions...');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sessions`);
      const sortedSessions = response.data
        .sort((a, b) => new Date(b.timestamp[0]) - new Date(a.timestamp[0]));
      setSessions(sortedSessions);
    } catch (error) {
      console.error('Error fetching session data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionClick = async (sessionId) => {
    setLoadingSessionId(sessionId);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sessions/analysis/${sessionId}`);
      if (response.status === 200 && response.data.analysisResults) {
        setExistingAnalysis((prev) => ({ ...prev, [sessionId]: true }));
      } else {
        setExistingAnalysis((prev) => ({ ...prev, [sessionId]: false }));
      }
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const analysisResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sessions/analyze/${sessionId}`);
          if (analysisResponse.data?.analysisResults) {
            setExistingAnalysis((prev) => ({ ...prev, [sessionId]: true }));
          }
        } catch (error) {
          console.error('Error during analysis process:', error.response?.data || error.message);
        }
      } else {
        console.error('Error during analysis request:', error.response?.data || error.message);
      }
    } finally {
      setLoadingSessionId(null);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const location = useLocation();
  const { username } = location.state || {};

  const handleLogout = () => {
    console.log(`${username} logged out.`);
    navigate('/', { state: { username } });
  };

  const filteredSessions = sessions.filter((session) =>
    (session.sessionName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (session.gameName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar username={username} handleLogout={handleLogout} role="admin" />

      <div className="scrollable-table-container">
        <h1 className="text-center">
          SESSIONS
          {isLoading && (
            <span role="img" aria-label="loading" style={{ marginLeft: '10px' }}>
              ⌛
            </span>
          )}
        </h1>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Player Name or Game Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!isLoading && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Game</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, index) => {
                const { date, time } = formatDateTime(session.timestamp);
                return (
                  <tr key={session.sessionId || index}>
                    <td>{session.sessionName || 'N/A'}</td>
                    <td>{session.gameName || 'N/A'}</td>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>
                      <button
                        className="analyze-button"
                        onClick={() => handleSessionClick(session.sessionId)}
                        disabled={loadingSessionId === session.sessionId}
                      >
                        Analyze
                        {loadingSessionId === session.sessionId && (
                          <span
                            className="spinner-border spinner-border-sm loading-spinner"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                      </button>
                      {existingAnalysis[session.sessionId] && (
                        <div>
                          <Link
                            to={`/analysis/${session.sessionId}`}
                            className="overall-analysis-button"
                            style={{ marginRight: '10px' }}
                            state={{ username }}
                          >
                            Overall Analysis
                          </Link>
                          <br />
                          <Link
                            to={`/DetailedAnalysis/${session.sessionId}`}
                            className="detailed-analysis-button"
                            state={{ username }}
                          >
                            Detailed Analysis
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Analysis;
