const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const connectToDB = require('./db_connection');  // Import the db connection
const Session = require('./schema');  // Import the session schema
const cors = require('cors');

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

        await saveAnalysisResult(imagePath, newSessionId); // Save the result to MongoDB
        res.status(200).json({ message: 'Image uploaded and data saved to DB' });
    } catch (error) {
        console.error('Error saving to DB:', error);
        res.status(500).json({ error: 'Failed to save image or session data' });
    }
});

async function saveAnalysisResult(imagePath, sessionId) {
    try {
        const newAnalysis = new Session({
            imagePath: imagePath,
            sessionId: sessionId, // Include sessionId here
        });
        await newAnalysis.save();
        console.log('Analysis result saved to MongoDB');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        throw error;
    }
}

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
