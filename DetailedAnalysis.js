// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

// const ExpressionAnalysis = () => {
//   // State to manage selected emotion
//   const [selectedEmotion, setSelectedEmotion] = useState('all');
  
//   const { sessionId } = useParams();
//   console.log(sessionId);

//   // Sample data for images and emotions
//   const imageSets = [
//     {
//       emotion: 'happy',
//       webcamImage: 'uploads/1727247079189-capture.png',
//       gameImage: 'screenshots/1727420677237-screenshot.png',
//       timestamp: '2024-09-27 14:30:00',
//       analysisLink: 'analysis.html?id=1',
//       percentages: 'Happy: 75%'
//     },
//     {
//       emotion: 'sad',
//       webcamImage: 'webcam2.jpg',
//       gameImage: 'game2.jpg',
//       timestamp: '2024-09-27 14:32:00',
//       percentages: 'Sad: 80% | Angry: 5% | Happy: 15%',
//       analysisLink: '#'
//     },
//     {
//       emotion: 'angry',
//       webcamImage: 'webcam3.jpg',
//       gameImage: 'game3.jpg',
//       timestamp: '2024-09-27 14:34:00',
//       percentages: 'Angry: 60% | Happy: 20% | Surprised: 20%',
//       analysisLink: 'analysis.html?id=3'
//     },
//     {
//       emotion: 'surprised',
//       webcamImage: 'webcam4.jpg',
//       gameImage: 'game4.jpg',
//       timestamp: '2024-09-27 14:36:00',
//       percentages: 'Surprised: 85% | Angry: 5% | Happy: 10%',
//       analysisLink: 'analysis.html?id=4'
//     },
//     {
//       emotion: 'happy',
//       webcamImage: 'C:/Users/ksuja/OneDrive/Desktop/annnaylasisiisss/uploads/1727247079189-capture.png',
//       gameImage: 'game5.jpg',
//       timestamp: '2024-09-27 14:38:00',
//       percentages: 'Happy: 65% | Sad: 20% | Angry: 15%',
//       analysisLink: 'analysis.html?id=5'
//     },
//     {
//       emotion: 'sad',
//       webcamImage: 'webcam6.jpg',
//       gameImage: 'game6.jpg',
//       timestamp: '2024-09-27 14:40:00',
//       percentages: 'Sad: 70% | Surprised: 20% | Angry: 10%',
//       analysisLink: 'analysis.html?id=6'
//     },
//   ];

//   // Handle the selection of emotion
//   const handleEmotionChange = (event) => {
//     setSelectedEmotion(event.target.value);
//   };

//   return (
//     <div className="container mt-4">
//       <h1 className="text-center">Expression Analysis</h1>

//       {/* Search by Emotion */}
//       <div className="my-3">
//         <label htmlFor="emotionSearch">Search by Emotion</label>
//         <select id="emotionSearch" className="form-select" onChange={handleEmotionChange}>
//           <option value="all">All Emotions</option>
//           <option value="happy">Happy</option>
//           <option value="sad">Sad</option>
//           <option value="angry">Angry</option>
//           <option value="surprised">Surprised</option>
//         </select>
//       </div>

//       {/* Expression Images Grid */}
//       <div className="row" id="imageGrid">
//         {imageSets
//           .filter(imageSet => selectedEmotion === 'all' || imageSet.emotion === selectedEmotion)
//           .map((imageSet, index) => (
//             <div className="col-md-4 mb-3" key={index} data-emotion={imageSet.emotion}>
//               <div className="card">
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-6">
//                       <img src={imageSet.webcamImage} alt="Webcam Image" className="img-fluid" />
//                     </div>
//                     <div className="col-6">
//                       <img src={imageSet.gameImage} alt="Game Screenshot" className="img-fluid" />
//                     </div>
//                   </div>
//                   <p className="mt-3">{imageSet.percentages}</p>
//                   <p><strong>Timestamp:</strong> {imageSet.timestamp}</p>
//                   {/* <a href={imageSet.analysisLink} className="btn btn-primary">View Analysis</a> */}
//                 </div>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default ExpressionAnalysis;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios'; // Import Axios for API calls
// import './DetailedAnalysis.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ExpressionAnalysis = () => {
//   const [sessionData, setSessionData] = useState(null); // State to hold session data from MongoDB
//   const [selectedEmotion, setSelectedEmotion] = useState('all'); // State for selected emotion
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state

//   const { sessionId } = useParams(); // Get sessionId from URL params
//  console.log(sessionId);
//   // Fetch session data from backend
//   useEffect(() => {
//     const fetchSessionData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/detailed_sessions/${sessionId}`);
//         console.log('Fetched session data:', response.data); // Log fetched data
//         setSessionData(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching session data');
//         setLoading(false);
//       }
//     };
//     fetchSessionData();
//   }, [sessionId]);
//   // Log sessionData after it's updated
// useEffect(() => {
//     if (sessionData) {
//       console.log('Updated sessionData:', sessionData); // Log updated sessionData
//     }
//   }, [sessionData]);
//   // Handle the selection of emotion
//   const handleEmotionChange = (event) => {
//     setSelectedEmotion(event.target.value);
//   };

//   if (loading) {
//     return <p>Loading...</p>; // Display loading state
//   }

//   if (error) {
//     return <p>{error}</p>; // Display error message
//   }

//   // Ensure sessionData exists before rendering
//   if (!sessionData) {
//     return <p>No data found for this session.</p>;
//   }

//   return (
//     <div className="container mt-4">
//       <h1 className="text-center">Expression Analysis</h1>

//       {/* Search by Emotion */}
//       <div className="my-3">
//         <label htmlFor="emotionSearch">Search by Emotion</label>
//         <select id="emotionSearch" className="form-select" onChange={handleEmotionChange}>
//           <option value="all">All Emotions</option>
//           <option value="happy">Happy</option>
//           <option value="sad">Sad</option>
//           <option value="angry">Angry</option>
//           <option value="surprised">Surprised</option>
//         </select>
//       </div>

//       {/* Expression Images Grid */}
// <div className="row" id="imageGrid">
// {sessionData.imagePaths.map((webcamImage, index) => {
//   const gameImage = sessionData.screenshotPaths[index];
//   const modelResponse = sessionData.modelResponse[index];
//   const timestamp = sessionData.timestamp[index] || 'N/A'; // Default timestamp if not available
//     console.log(modelResponse);
//   return (
//     <div className="col-md-6 mb-3" key={index} data-emotion={modelResponse[0]?.label}>
//       <div className="card">
//         <div className="card-body">
//           <div className="row coustom-width-row" >
//             <div className="col-6">
//               <img src={`http://localhost:5000/${webcamImage.replace(/\\/g, '/')}`} alt="Webcam Image" className="img-fluid" />
//             </div>
//             <div className="col-6">
//               <img src={`http://localhost:5000/${gameImage.replace(/\\/g, '/')}`} alt="Game Screenshot" className="img-fluid" />
//             </div>
//           </div>
//           <p className="mt-3">
//   {modelResponse.map((response, i) => (
//     <span key={i}>
//       {response.label.charAt(0).toUpperCase() + response.label.slice(1)}: {(
//         response.score * 100
//       ).toFixed(2)}% {/* Convert score to percentage */}
//       {i < modelResponse.length - 1 ? ' | ' : ''} {/* Use '|' as separator */}
//     </span>
//   ))}
// </p>
// {/* <p><strong>Timestamp:</strong> {timestamp}</p> */}
//         </div>
//       </div>
//     </div>
//   );
// })}

// </div>

//     </div>
//   );
// };

// export default ExpressionAnalysis;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './DetailedAnalysis.css';

const ExpressionAnalysis = () => {
  const [sessionData, setSessionData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const { sessionId } = useParams(); 

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/detailed_sessions/${sessionId}`);
        console.log('Fetched session data:', response.data);
        setSessionData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching session data');
        setLoading(false);
      }
    };
    fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    if (sessionData) {
      console.log('Updated sessionData:', sessionData);
    }
  }, [sessionData]);

  const calculateHighestEmotion = (emotionArray) => {
    let highestEmotion = { label: '', score: 0 };

    emotionArray.forEach((emotionObject) => {
      if (emotionObject.score > highestEmotion.score) {
        highestEmotion = {
          label: emotionObject.label,
          score: emotionObject.score * 100, // Convert score to percentage
        };
      }
    });

    return highestEmotion;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!sessionData || !sessionData.imagePaths || !sessionData.screenshotPaths || !sessionData.modelResponse) {
    return <p>No data found for this session.</p>;
  }

  return (
    <div className="container-fluid">
      <h2>Detailed Analysis</h2>
      <div className="image-strip-container">
        <div className="image-strip">
          {sessionData.imagePaths.map((imagePath, index) => {
            const emotions = sessionData.modelResponse[index];
            const highestEmotion = calculateHighestEmotion(emotions);
            const timestamp = (index + 1) * 10;

            return (
              <div key={index} className="image-box">
                <div className="time-percentage">
                  {highestEmotion.label}: {highestEmotion.score.toFixed(2)}% - Captured at {timestamp}s
                </div>
                <div className="image-container">
                  <img src={`http://localhost:5000/${sessionData.screenshotPaths[index]}`} alt={`Screenshot ${index + 1}`} />
                  <img src={`http://localhost:5000/${imagePath}`} alt={`Webcam ${index + 1}`} />
                </div>
                <div className="detailed-analysis">
                  <strong>Detailed Analysis:</strong><br />
                  {emotions.map((emotionObject, emotionIndex) => (
                    <div key={emotionIndex}>
                      {emotionObject.label}: {(emotionObject.score * 100).toFixed(2)}%
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>)
};

export default ExpressionAnalysis;
