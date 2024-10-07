import React, { useState } from 'react';
const Detailed = () => {
  return (
    <div>
      <h2>Detailed Analysis</h2>
      <p>Here you can display detailed information, charts, graphs, and more.</p>
    </div>
  );
};
const ExpressionAnalysis = () => {
  // State to manage selected emotion
  const [selectedEmotion, setSelectedEmotion] = useState('all');

  // Sample data for images and emotions
  const imageSets = [
    {
      emotion: 'happy',
      webcamImage: 'uploads/1727247079189-capture.png',
      gameImage: 'screenshots/1727420677237-screenshot.png',
      timestamp: '2024-09-27 14:30:00',
      analysisLink: 'analysis.html?id=1',
      percentages: 'Happy: 75%'
    },
    {
      emotion: 'sad',
      webcamImage: 'webcam2.jpg',
      gameImage: 'game2.jpg',
      timestamp: '2024-09-27 14:32:00',
      percentages: 'Sad: 80% | Angry: 5% | Happy: 15%',
      analysisLink: '#'
    },
    {
      emotion: 'angry',
      webcamImage: 'webcam3.jpg',
      gameImage: 'game3.jpg',
      timestamp: '2024-09-27 14:34:00',
      percentages: 'Angry: 60% | Happy: 20% | Surprised: 20%',
      analysisLink: 'analysis.html?id=3'
    },
    {
      emotion: 'surprised',
      webcamImage: 'webcam4.jpg',
      gameImage: 'game4.jpg',
      timestamp: '2024-09-27 14:36:00',
      percentages: 'Surprised: 85% | Angry: 5% | Happy: 10%',
      analysisLink: 'analysis.html?id=4'
    },
    {
      emotion: 'happy',
      webcamImage: 'C:/Users/ksuja/OneDrive/Desktop/annnaylasisiisss/uploads/1727247079189-capture.png',
      gameImage: 'game5.jpg',
      timestamp: '2024-09-27 14:38:00',
      percentages: 'Happy: 65% | Sad: 20% | Angry: 15%',
      analysisLink: 'analysis.html?id=5'
    },
    {
      emotion: 'sad',
      webcamImage: 'webcam6.jpg',
      gameImage: 'game6.jpg',
      timestamp: '2024-09-27 14:40:00',
      percentages: 'Sad: 70% | Surprised: 20% | Angry: 10%',
      analysisLink: 'analysis.html?id=6'
    },
  ];

  // Handle the selection of emotion
  const handleEmotionChange = (event) => {
    setSelectedEmotion(event.target.value);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Expression Analysis</h1>

      {/* Search by Emotion */}
      <div className="my-3">
        <label htmlFor="emotionSearch">Search by Emotion</label>
        <select id="emotionSearch" className="form-select" onChange={handleEmotionChange}>
          <option value="all">All Emotions</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
          <option value="surprised">Surprised</option>
        </select>
      </div>

      {/* Expression Images Grid */}
      <div className="row" id="imageGrid">
        {imageSets
          .filter(imageSet => selectedEmotion === 'all' || imageSet.emotion === selectedEmotion)
          .map((imageSet, index) => (
            <div className="col-md-4 mb-3" key={index} data-emotion={imageSet.emotion}>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-6">
                      <img src={imageSet.webcamImage} alt="Webcam Image" className="img-fluid" />
                    </div>
                    <div className="col-6">
                      <img src={imageSet.gameImage} alt="Game Screenshot" className="img-fluid" />
                    </div>
                  </div>
                  <p className="mt-3">{imageSet.percentages}</p>
                  <p><strong>Timestamp:</strong> {imageSet.timestamp}</p>
                  <a href={imageSet.analysisLink} className="btn btn-primary">View Analysis</a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExpressionAnalysis;
