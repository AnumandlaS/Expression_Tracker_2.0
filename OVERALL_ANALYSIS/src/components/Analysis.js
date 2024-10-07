// import React, { useEffect, useState } from "react";

// const Analysis = () => {
//   const [sessions, setSessions] = useState([]);
//   const [images, setImages] = useState([]); // State for images
//   const [screenshots, setScreenshots] = useState([]); // State for screenshots
//   const [selectedSessionId, setSelectedSessionId] = useState(null);
//   const [analysisResults, setAnalysisResults] = useState(null);  
//   const [loadingAnalysis, setLoadingAnalysis] = useState(false); 

//   // Fetch sessions from backend
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/sessions");
//         if (!response.ok) {
//           throw new Error("Failed to fetch sessions");
//         }
//         const data = await response.json();
//         setSessions(data);
//       } catch (error) {
//         console.error("Error fetching sessions:", error);
//       }
//     };

//     fetchSessions();
//   }, []);

//   const handleSessionClick = async (sessionId) => {
//     setSelectedSessionId(sessionId);
//     try {
//       const response = await fetch(`http://localhost:5000/sessions/${sessionId}/media`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch images and screenshots");
//       }
//       const data = await response.json();
//       // Combine images and screenshots into a single array
//       const media = [...(data.imagePaths || []), ...(data.screenshotPaths || [])];
//       setImages(media);
//     } catch (error) {
//       console.error("Error fetching images and screenshots:", error);
//     }
//   };
  

//   // Fetch analysis for a selected session
//   const handleFetchAnalysis = async () => {
//     if (!selectedSessionId) return;

//     setLoadingAnalysis(true);  // Set loading to true while the analysis is processing
//     try {
//       const response = await fetch(`http://localhost:5000/sessions/${selectedSessionId}/analyze`, {
//         method: 'POST'
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch analysis");
//       }
//       const data = await response.json();
//       setAnalysisResults(data.analysisResults);  // Store the analysis results
//       setLoadingAnalysis(false);  // Set loading to false after analysis completes
//     } catch (error) {
//       console.error("Error fetching analysis:", error);
//       setLoadingAnalysis(false);
//     }
//   };

//   return (
//     <div className="analysis">
//       <h2>Analysis Section</h2>
//       {sessions.length > 0 ? (
//         <ul>
//           {sessions.map((sessionId) => (
//             <li key={sessionId}>
//               <button onClick={() => handleSessionClick(sessionId)}>
//                 Session ID: {sessionId}
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No sessions available.</p>
//       )}
      
//       {selectedSessionId && (
//         <div>
//           <h3>Media for Session ID: {selectedSessionId}</h3>

//           {/* Render Images */}
//           <h4>Images:</h4>
//           {images.length > 0 ? (
//   <div>
//     {images.map((mediaPath, index) => (
//       <img 
//         key={index} 
//         src={`http://localhost:5000/${mediaPath}`} 
//         alt="Session Capture" 
//         style={{ width: '100px', margin: '10px' }} 
//       />
//     ))}
//   </div>
// ) : (
//   <p>No media captured for this session.</p>
// )}


//           {/* Fetch Analysis button */}
//           <button onClick={handleFetchAnalysis} disabled={loadingAnalysis}>
//             {loadingAnalysis ? 'Fetching Analysis...' : 'Fetch Analysis'}
//           </button>

//           {/* Display analysis results if available */}
//           {analysisResults && (
//             <div className="analysis-results">
//               <h4>Analysis Results</h4>
//               {analysisResults.map((result, index) => (
//                 <div key={index}>
//                   <p>Image: {result.imagePath}</p>
//                   <pre>{JSON.stringify(result.modelResponse, null, 2)}</pre>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Analysis;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Analysis.css';

const Analysis = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch all sessions from the backend
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

  // Handle clicking on a session ID link
  const handleSessionClick = async (sessionId) => {
    try {
      console.log(`Requesting analysis for session ID: ${sessionId}`);
  
      // Initial request to check if analysis already exists
      const response = await axios.get(`http://localhost:5000/sessions/analysis/${sessionId}`);
  
      // If analysis already exists, navigate to the analysis page
      if (response.data && response.data.analysisResults) {
        console.log("Analysis already exists:", response.data.analysisResults);
        navigate(`/analysis/${sessionId}`);
      }
  
    } catch (error) {
      // Check if the error is a 404 (No analysis found)
      if (error.response && error.response.status === 404) {
        console.log("No analysis found. Sending images to Hugging Face model...");
  
        try {
          // Fetch the media associated with the session
          const mediaResponse = await axios.get(`http://localhost:5000/sessions/media/${sessionId}`);
          const { imagePaths, screenshotPaths } = mediaResponse.data;
          const media = [...(imagePaths || []), ...(screenshotPaths || [])];
  
          if (media.length === 0) {
            console.error("No media found for session.");
            return;
          }
  
          // Call the Hugging Face model with the media
          const analysisResponse = await axios.post(`http://localhost:5000/sessions/analyze/${sessionId}`, {
            images: media
          });
  
          // Save the analysis results back into the database
          const analysisResults = analysisResponse.data.analysisResults;
          await axios.post(`http://localhost:5000/sessions/${sessionId}/save-analysis`, { analysisResults });
  
          // Navigate to the analysis page after saving
          navigate(`/analysis/${sessionId}`);
        } catch (error) {
          console.error("Error during analysis process:", error.response ? error.response.data : error.message);
        }
  
      } else {
        // If another error occurs, log it
        console.error('Error during analysis request:', error.response ? error.response.data : error.message);
      }
    }
  };
  
  
  

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
                  <button onClick={() => handleSessionClick(session.sessionId)}>
                    {session.sessionId.slice(-4)} {/* Displaying last 4 digits */}
                  </button>
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
