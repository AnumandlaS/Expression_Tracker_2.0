//import necessary modules and componenets from react,
//The useState hook lets you add state variables to your functional components. Before hooks, only class components could have state, but useState allows us to manage state in functional components too.
//The useEffect hook lets you run side effects in your components, such as data fetching, subscriptions, or manual DOM manipulations.
import React, { useState, useEffect } from 'react';
import axios from 'axios';//for https requests
import { Link, useNavigate } from 'react-router-dom';//we useNavigate for programmatic navigation.
import './Analysis.css';

const Analysis = () => {
  // Define state variables for handling session data, analysis status, loading states, and navigation.
  const [sessions, setSessions] = useState([]);// Stores fetched session data.
  const [existingAnalysis, setExistingAnalysis] = useState({});// Tracks which sessions have existing analysis.
  const [isLoading, setIsLoading] = useState(true);// Indicates whether the session data is being loaded.
  const [loadingSessionId, setLoadingSessionId] = useState(null);// Tracks which session is currently being analyzed.
  const navigate = useNavigate();// Enables navigation to other routes.
  
  // Function to fetch session data from the backend.
  const fetchSessions = async () => {
    try { //
      
      const response = await axios.get(process.env.REACT_APP_SESSIONS);// send get request to backend that is server for getting the session existing id
      console.log("API Response:", response.data);
      const sortedSessions = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));//this will sort the existing sessions in backend
      setSessions(sortedSessions);// it will set the sessions in an order that is lastest time will be on top
    } catch (error) {//if sessions are not able to be fetched it will come here 
      console.error('Error fetching session data:', error);
    } finally {//here we will set setisloading to false before it is true
      setIsLoading(false);
    }
  };

  // useEffect hook to fetch session data once on component mount.
  useEffect(() => {
    fetchSessions();// Call fetchSessions function on mount 
  }, []);
  // Function to handle clicks on a session for analysis.
  const handleSessionClick = async (sessionId) => {
    setLoadingSessionId(sessionId);//this will set the null to the specified sessionid
    try {
      console.log(`Requesting analysis for session ID: ${sessionId}`);//printing the message that it is resquesting the analysis for the given sessionid
      
      const response = await axios.get(`${process.env.REACT_APP_SESSION_ANALYSIS}/${sessionId}`);//we are giving an api call to backend to this function over there
      //then we will get back from there either 404 or 200 or 500
      // if it gives 200 it is saying that for thgat particular session id the it will print thet alreday anaylsis is pt=resent
      if (response.status === 200 && response.data && response.data.analysisResults) {
        console.log("Analysis already exists:", response.data.analysisResults);
        setExistingAnalysis((prevState) => ({//
          ...prevState,
          [sessionId]: true,
        }));
      } else {
        // If no analysis exists, mark session for new analysis.
        setExistingAnalysis((prevState) => ({
          ...prevState,
          [sessionId]: false,
        }));
      }
    } catch (error) {
      // If no existing analysis is found (404), fetch media data and send for new analysis.
      if (error.response && error.response.status === 404) {
        console.log("No analysis found. Sending images to Hugging Face model...");
        try {
          const mediaResponse = await axios.get(`${process.env.REACT_APP_MEDIA}/${sessionId}`);
          const { imagePaths = [], screenshotPaths = [] } = mediaResponse.data;// Retrieve image and screenshot paths.
          // Combine images and screenshots into a single array.
          const media = [...imagePaths, ...screenshotPaths];

          if (media.length === 0) {
            console.error("No media found for session.");
            return; // Exit if no media is available.
          }
           // Send the images for analysis via POST request.
          const analysisResponse = await axios.post(`${process.env.REACT_APP_ANALYZE_POST}/${sessionId}`, { images: media });

          if (analysisResponse.data && analysisResponse.data.analysisResults) {
            const analysisResults = analysisResponse.data.analysisResults;
            

            // Optionally, save analysis results to the backend (code currently commented out).
            // await axios.post(`http://localhost:5000/sessions/${sessionId}/save-analysis`, { analysisResults });

            setExistingAnalysis((prevState) => ({
              ...prevState,
              [sessionId]: true, // Update state to indicate analysis exists.
            }));
            navigate(`/analysis`);// Navigate to the analysis page.
          } else {
            console.error("Analysis response did not contain results:", analysisResponse.data);
          }
        } catch (error) {
          console.error("Error during analysis process:", error.response ? error.response.data : error.message);
        }
      } else {
        console.error('Error during analysis request:', error.response ? error.response.data : error.message);
      }
    } finally {
      setLoadingSessionId(null); // Reset loading state after processing
    }
  };

  const handleHomeClick = () => {
    navigate('/'); // Navigates to the home page
  };

// Render the session list with options to analyze and view results.

  return (
    <div>

    <div className="container mt-4 scrollable-table-container">
      <h1 className="text-center">
        SESSIONS
        {isLoading && (//here first it will check whetherthe is loading true or false if it is true it will enter into the part and here it will show the ar glass 
          <span role="img" aria-label="loading" style={{ marginLeft: '10px' }}>
            ⌛
          </span>
        )}
      </h1>
      {!isLoading && (//if isloading is falsetheen it will enter into it here it will stop showing the ar glass and it will display the table
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => {
              let date = 'N/A';//if dat and time are not there it will show n/a
              let time = 'N/A';
              if (session.timestamp) {
                const timestamp = new Date(session.timestamp);
                date = timestamp.toLocaleDateString();//this will call the localdatastring function which is in backend for showing the date and time in an understanble manner
                time = timestamp.toLocaleTimeString();
              }
              //andit will return the following details like  ....
              return (
                <tr key={session.sessionId || index}>
                  <td>{session.sessionName}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>
                    <button //and when we click on that analyse button it will call the handlesessionclick function and it will also pass that particular session id
                      className="analyze-button" 
                      onClick={() => handleSessionClick(session.sessionId)} 
                      disabled={loadingSessionId === session.sessionId}
                    >
                      Analyze
                      {loadingSessionId === session.sessionId && (
                        <span className="spinner-border spinner-border-sm loading-spinner" role="status" aria-hidden="true"></span>
                      )}
                    </button>
                    
                    {existingAnalysis[session.sessionId] && (//then after every analysis done it will display two buttons that areboverall analysis and detailed analysis
                      <div>
                        <Link to={`/analysis/${session.sessionId}`} className="overall-analysis-button" style={{ marginRight: '10px' }}>
                          Overall Analysis
                        </Link><br />
                        <Link to={`/DetailedAnalysis/${session.sessionId}`} className="detailed-analysis-button">
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
    <div className="text-center mt-4">
        <button className="home-button" onClick={handleHomeClick}>
          Home
        </button>
      </div>
    </div>
    
  );
};

export default Analysis;
