const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const connectToDB = require('./db_connection');  // Import the db connection
const Session = require('./schema');  // Import the session schema
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

require('dotenv').config();  // Load environment variables
const app = express();

// Allow requests from localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
}));

// Get all unique session IDs
app.get('/sessions', async (req, res) => {
    try {
        const sessions = await Session.distinct('sessionId');
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

// Get images for a specific session ID
app.get('/sessions/:sessionId/images', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const sessionImages = await Session.find({ sessionId });
        res.status(200).json(sessionImages);
    } catch (error) {
        console.error(`Error fetching images for session ${sessionId}:`, error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve uploaded screenshots
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');  // Path to the uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

const screenshotStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const screenshotDir = './screenshots';  // Path to the screenshots folder
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        cb(null, screenshotDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const uploadScreenshot = multer({ storage: screenshotStorage });

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle image uploads
app.post('/uploads', upload.single('image'), async (req, res) => {
    try {
        console.log('Uploaded file:', req.file);

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { newSessionId } = req.body;
        const imagePath = req.file.path;  // Use the path from multer

        await saveAnalysisResult(imagePath, newSessionId,'image'); // Save the result to MongoDB
        res.status(200).json({ message: 'Image uploaded and data saved to DB' });
    } catch (error) {
        console.error('Error saving to DB:', error);
        res.status(500).json({ error: 'Failed to save image or session data' });
    }
});
// Endpoint to handle screenshot uploads (stored in 'screenshots' folder)
app.post('/screenshots', uploadScreenshot.single('screenshot'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No screenshot uploaded' });
        }

        const { newSessionId } = req.body;
        const screenshotPath = req.file.path;  // Use the path from multer (screenshots/)

        // Save screenshot path to MongoDB
        await saveAnalysisResult(screenshotPath, newSessionId, 'screenshot');  // Indicate it's a screenshot
        res.status(200).json({ message: 'Screenshot uploaded and path saved to DB' });
    } catch (error) {
        console.error('Error saving screenshot to DB:', error);
        res.status(500).json({ error: 'Failed to save screenshot or session data' });
    }
});


async function saveAnalysisResult(filePath, sessionId, fileType) {
    try {
        const update = {};

        // Store the correct path depending on file type (image or screenshot)
        if (fileType === 'image') {
            update.imagePath = filePath;
        } else if (fileType === 'screenshot') {
            update.screenshotPath = filePath;
        }

        // Find the session by sessionId and update with the file path
        await Session.findOneAndUpdate(
            { sessionId: sessionId },
            { $set: update },
            { upsert: true, new: true }
        );

        console.log(`${fileType} path saved to MongoDB`);
    } catch (error) {
        console.error('Error saving file path to MongoDB:', error);
        throw error;
    }
}


const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_URL="https://api-inference.huggingface.co/models/trpakov/vit-face-expression";
// Middleware to get image, send to model, and save the response
// Fetch analysis for images of a specific session
app.post('/sessions/:sessionId/analyze', async (req, res) => {
  const { sessionId } = req.params;

  try {
      // Find the session's images from MongoDB
      const sessionImages = await Session.find({ sessionId });

      if (!sessionImages || sessionImages.length === 0) {
          return res.status(404).json({ error: 'No images found for the given session ID' });
      }

      // Assuming you're dealing with multiple images, you can loop through them
      const analysisResults = [];
      for (const sessionImage of sessionImages) {
          const imagePath = sessionImage.imagePath;
          const imageBuffer = fs.readFileSync(imagePath); // Read the image file from the server
          // Send the image to Hugging Face model
          let modelResponse;
          try{
           modelResponse = await sendImageToModel(imageBuffer);
           analysisResults.push({
            imagePath: imagePath,
            modelResponse: modelResponse
        });
        console.log('Model Response before saving:', modelResponse);
        // Update the document with the model response
        await Session.findOneAndUpdate(
          { _id: sessionImage._id },
          { modelResponse: modelResponse },  // Add the response from the Hugging Face model
          { new: true }  // Return the updated document
      );
          } catch(error)
          {
            console.error("Error analyzing images:", error.message);
            console.log(imageBuffer);
            return res.status(500).json({ error: "Failed to process the image with Hugging Face" });

          }

          
      }

      // Return the analysis results to the client
      res.status(200).json({ message: 'Analysis completed and results saved', analysisResults });
  } catch (error) {
      console.error(`Error analyzing images for session ${sessionId}:`, error);
      res.status(500).json({ error: 'Failed to analyze images' });
  }
});


// Helper function to send the image to Hugging Face model
async function sendImageToModel(imageBuffer,retries=3,delay=2000) {
  for(let i=0;i<retries;i++)
  {
  try {
    const response = await axios.post(
      MODEL_URL,
      imageBuffer,
      {
        headers: {
          Authorization:  process.env.HUGGING_FACE_API_KEY,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    // The response from the Hugging Face model
    return response.data;
  } catch (error) {
    console.error('Error sending image to Hugging Face model:', error);
    throw new Error('Failed to process the image with Hugging Face');
  }
}}
(async () => {
    try {
        await connectToDB(); // Establish the MongoDB connection
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
})();
