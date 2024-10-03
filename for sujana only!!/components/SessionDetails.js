// // // import React, { useEffect, useState } from "react";
// // // import { useParams } from "react-router-dom"; // Import useParams

// // // const SessionDetail = () => {
// // //   const { sessionId } = useParams(); // Get sessionId from the URL
// // //   const [images, setImages] = useState([]); // State for images
// // //   const [loading, setLoading] = useState(true); // State for loading

// // //   // Fetch media for the selected session ID
// // //   useEffect(() => {
// // //     const fetchMedia = async () => {
// // //       try {
// // //         const response = await fetch(`http://localhost:5000/sessions/${sessionId}/media`);
// // //         if (!response.ok) {
// // //           throw new Error("Failed to fetch images and screenshots");
// // //         }
// // //         const data = await response.json();

// // //         // Check for image and screenshot paths
// // //         const media = [
// // //           ...(data.imagePaths || []),
// // //           ...(data.screenshotPaths || [])
// // //         ];

// // //         setImages(media);
// // //       } catch (error) {
// // //         console.error("Error fetching images and screenshots:", error);
// // //       } finally {
// // //         setLoading(false); // Set loading to false after fetching
// // //       }
// // //     };

// // //     fetchMedia();
// // //   }, [sessionId]);

// // //   return (
// // //     <div className="session-detail">
// // //       <h2>Media for Session ID: {sessionId}</h2>

// // //       {loading ? (
// // //         <p>Loading...</p> // Show loading text while fetching
// // //       ) : (
// // //         <div>
// // //           {images.length > 0 ? (
// // //             <div>
// // //               {images.map((mediaPath, index) => (
// // //                 <img
// // //                   key={index}
// // //                   src={`http://localhost:5000/${mediaPath}`}
// // //                   alt="Session Media"
// // //                   style={{ width: '100px', margin: '10px' }}
// // //                 />
// // //               ))}
// // //             </div>
// // //           ) : (
// // //             <p>No media captured for this session.</p>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default SessionDetail;
// // // SessionDetail.js
// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";

// // const SessionDetail = () => {
// //   const { sessionId } = useParams();
// //   const [images, setImages] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [analysisResults, setAnalysisResults] = useState([]);
// //   const [loadingAnalysis, setLoadingAnalysis] = useState(false);

// //   // Fetch media for the session
// //   useEffect(() => {
// //     const fetchMedia = async () => {
// //       try {
// //         const response = await fetch(`http://localhost:5000/sessions/${sessionId}/media`);
// //         if (!response.ok) {
// //           throw new Error("Failed to fetch images and screenshots");
// //         }
// //         const data = await response.json();
// //         const media = [
// //           ...(data.imagePaths || []),
// //           ...(data.screenshotPaths || [])
// //         ];
// //         setImages(media);
// //       } catch (error) {
// //         console.error("Error fetching images and screenshots:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchMedia();
// //   }, [sessionId]);

// //   // Fetch analysis for all images in the session
// //   const handleFetchAnalysis = async () => {
// //     setLoadingAnalysis(true);
// //     try {
// //       const analysisPromises = images.map(async (mediaPath) => {
// //         const response = await fetch(`http://localhost:5000/analyze`, {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({ imagePath: mediaPath }), // Adjust this to fit your backend API
// //         });
// //         if (!response.ok) {
// //           throw new Error("Failed to fetch analysis");
// //         }
// //         return await response.json(); // Assuming the response contains the analysis result
// //       });

// //       const results = await Promise.all(analysisPromises);
// //       setAnalysisResults(results); // Store the analysis results
// //     } catch (error) {
// //       console.error("Error fetching analysis:", error);
// //     } finally {
// //       setLoadingAnalysis(false);
// //     }
// //   };

// //   return (
// //     <div className="session-detail">
// //       <h2>Media for Session ID: {sessionId}</h2>
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <div>
// //           {images.length > 0 ? (
// //             <div>
// //               {images.map((mediaPath, index) => (
// //                 <img
// //                   key={index}
// //                   src={`http://localhost:5000/${mediaPath}`}
// //                   alt="Session Media"
// //                   style={{ width: '100px', margin: '10px' }}
// //                 />
// //               ))}
// //               {/* Fetch Analysis button */}
// //               <button onClick={handleFetchAnalysis} disabled={loadingAnalysis}>
// //                 {loadingAnalysis ? 'Fetching Analysis...' : 'Fetch Analysis'}
// //               </button>
// //             </div>
// //           ) : (
// //             <p>No media captured for this session.</p>
// //           )}
// //         </div>
// //       )}

// //       {/* Display analysis results if available */}
// //       {analysisResults.length > 0 && (
// //         <div className="analysis-results">
// //           <h4>Analysis Results</h4>
// //           {analysisResults.map((result, index) => (
// //             <div key={index}>
// //               <p>Image: {result.imagePath || 'Unknown'}</p>
// //               <pre>{JSON.stringify(result.modelResponse, null, 2)}</pre>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default SessionDetail;
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// // Your component code here

// const SessionDetail = () => {
//     const { sessionId } = useParams();
//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [analysisResults, setAnalysisResults] = useState([]);
//     const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  
//     // Fetch media for the session
//     useEffect(() => {
//       const fetchMedia = async () => {
//         try {
//           const response = await fetch(`http://localhost:5000/sessions/${sessionId}/media`);
//           if (!response.ok) {
//             throw new Error("Failed to fetch images and screenshots");
//           }
//           const data = await response.json();
//           const media = [
//             ...(data.imagePaths || []),
//             ...(data.screenshotPaths || [])
//           ];
//           setImages(media);
//         } catch (error) {
//           console.error("Error fetching images and screenshots:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchMedia();
//     }, [sessionId]);
  
//     // Fetch analysis for all images in the session
//     const handleFetchAnalysis = async () => {
//       setLoadingAnalysis(true);
//       try {
//         const analysisPromises = images.map(async (mediaPath) => {
//           const response = await fetch(`http://localhost:5000/sessions/${sessionId}/analyze`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ imagePath: mediaPath }),
//           });
//           if (!response.ok) {
//             throw new Error("Failed to fetch analysis");
//           }
//           return await response.json();
//         });
  
//         const results = await Promise.all(analysisPromises);
//         setAnalysisResults(results);
//       } catch (error) {
//         console.error("Error fetching analysis:", error);
//       } finally {
//         setLoadingAnalysis(false);
//       }
//     };
  
//     return (
//       <div className="session-detail">
//         <h2>Media for Session ID: {sessionId}</h2>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <div>
//             {images.length > 0 ? (
//               <div>
//                 {images.map((mediaPath, index) => (
//                   <img
//                     key={index}
//                     src={`http://localhost:5000/${mediaPath}`}
//                     alt="Session Media"
//                     style={{ width: '100px', margin: '10px' }}
//                   />
//                 ))}
//                 <button onClick={handleFetchAnalysis} disabled={loadingAnalysis}>
//                   {loadingAnalysis ? 'Fetching Analysis...' : 'Fetch Analysis'}
//                 </button>
//               </div>
//             ) : (
//               <p>No media captured for this session.</p>
//             )}
//           </div>
//         )}
//         {analysisResults.length > 0 && (
//           <div className="analysis-results">
//             <h4>Analysis Results</h4>
//             {analysisResults.map((result, index) => (
//               <div key={index}>
//                 <p>Image: {result.imagePath || 'Unknown'}</p>
//                 <pre>{JSON.stringify(result.modelResponse, null, 2)}</pre>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   export default SessionDetail;
  
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SessionDetail = () => {
    const { sessionId } = useParams();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analysisResults, setAnalysisResults] = useState([]);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    // Fetch media for the session
    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const response = await fetch(`http://localhost:5000/sessions/${sessionId}/media`);
                if (!response.ok) {
                    throw new Error("Failed to fetch images and screenshots");
                }
                const data = await response.json();
                const media = [
                    ...(data.imagePaths || []),
                    ...(data.screenshotPaths || [])
                ];
                setImages(media);
                await handleFetchAnalysis(); 
            } catch (error) {
                console.error("Error fetching images and screenshots:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [sessionId]);

    // Fetch analysis for all images in the session
    // Fetch analysis for all images in the session
const handleFetchAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
        const response = await fetch(`http://localhost:5000/sessions/${sessionId}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imagePaths: images }), // Send all images in one request
        });

        if (!response.ok) {
            throw new Error("Failed to fetch analysis");
        }

        const results = await response.json();
        console.log("Analysis results:", results); // Log the analysis results to debug
        setAnalysisResults(results); // Assuming the results are in the correct format
    } catch (error) {
        console.error("Error fetching analysis:", error);
    } finally {
        setLoadingAnalysis(false);
    }
};

    return (
        <div className="session-detail">
            <h2>Media for Session ID: {sessionId}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {images.length > 0 ? (
                        <div>
                            {images.map((mediaPath, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000/${mediaPath}`}
                                    alt="Session Media"
                                    style={{ width: '100px', margin: '10px' }}
                                />
                            ))}
                            <button onClick={handleFetchAnalysis} disabled={loadingAnalysis}>
                                {loadingAnalysis ? 'Fetching Analysis...' : 'Fetch Analysis'}
                            </button>
                        </div>
                    ) : (
                        <p>No media captured for this session.</p>
                    )}
                </div>
            )}
            {analysisResults.length > 0 && (
    <div className="analysis-results">
        <h4>Analysis Results</h4>
        {analysisResults.map((result, index) => (
            <div key={index}>
                <p>Image: {result.imagePath || 'Unknown'}</p>
                <pre>{JSON.stringify(result, null, 5)}</pre> {/* Updated to display the full result */}
            </div>
        ))}
    </div>
)}

        </div>
    );
};

export default SessionDetail;
