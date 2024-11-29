const express = require("express");
const router = express.Router();
const { Session } = require("../schema.js");
const fs = require("fs");
const {
  getSessionMedia,
  sendImageToModel,
  saveAnalysisResults,
} = require("../helper/admin_helper.js");

// const getSessionMedia = async (sessionId) => {
//   try {
//     // Fetch the session by sessionId from MongoDB
//     const session = await Session.findOne({ sessionId: sessionId });
//     if (!session) {
//       return { error: "Session not found" };
//     }
//     console.log(
//       "this are the image paths in getSessionMedia function",
//       session.imagePaths
//     );

//     // Return imagePaths (add screenshotPaths if necessary)
//     return {
//       imagePaths: session.imagePaths || [],
//     };
//   } catch (error) {
//     console.error("Error fetching media:", error);
//     return { error: "Failed to fetch media" };
//   }
// };

// async function sendImageToModel(imageBuffer, retries = 5, delay = 5000) {
//   // Convert the image buffer to base64 encoding
//   console.log("SendImageToModel function called ");
//   const base64Image = imageBuffer.toString("base64");

//   for (let i = 0; i < retries; i++) {
//     try {
//       console.log("this is the token", process.env.HUGGING_FACE_API_KEY);

//       // Send the image to the Hugging Face model as base64
//       const response = await axios.post(
//         MODEL_URL,
//         { image: base64Image }, // Adjust the payload according to model requirements
//         {
//           headers: {
//             Authorization: process.env.HUGGING_FACE_API_KEY,
//             "Content-Type": "application/json", // Set content type to JSON
//           },
//         }
//       );

//       console.log(
//         "this is the response just after sending images for analysis:",
//         response.data
//       );

//       // If we get a successful response, return it
//       return response.data;
//     } catch (error) {
//       if (
//         error.response &&
//         error.response.status === 503 &&
//         error.response.data.error.includes("currently loading")
//       ) {
//         const estimatedTime = error.response.data.estimated_time || 5000;
//         console.log(
//           `Model is still loading, retrying in ${estimatedTime} milliseconds...`
//         );

//         // Wait for the estimated time before retrying
//         await new Promise((resolve) => setTimeout(resolve, estimatedTime));
//       } else if (error.response && error.response.status === 400) {
//         console.error(
//           "Error response data(chatgpt rec):",
//           error.response?.data
//         );

//         console.error(
//           "Bad request: Ensure you're sending the image in the correct format."
//         );
//         throw new Error(
//           "Failed to process the image with Hugging Face: Bad Request"
//         );
//       } else {
//         console.error(
//           "Error sending image to Hugging Face model:",
//           error.message
//         );
//         throw new Error("Failed to process the image with Hugging Face");
//       }
//     }
//   }

//   throw new Error("Exceeded retry limit, unable to process the image.");
// }

// const saveAnalysisResults = async (sessionId, analysisResults) => {
//   if (!Array.isArray(analysisResults)) {
//     console.error("Analysis results must be provided as an array");
//     return { success: false, message: "Analysis results must be an array" };
//   }

//   try {
//     // Find the session and update it with the analysis results
//     const updatedSession = await Session.findOneAndUpdate(
//       { sessionId },
//       { $set: { modelResponse: analysisResults } },
//       { new: true } // Ensures we get the updated session
//     );

//     if (!updatedSession) {
//       console.error("Session not found");
//       return { success: false, message: "Session not found" };
//     }

//     console.log("Analysis results saved successfully:", updatedSession);
//     return { success: true, session: updatedSession };
//   } catch (error) {
//     console.error("Error saving analysis results:", error);
//     return { success: false, message: "Error saving analysis results" };
//   }
// };

router.get("/", (req, res) => {
  res.send("Admin router also workingg!!");
});

// Get all session IDs, session names, and timestamps
router.get("/sessions", async (req, res) => {
  try {
    // Fetch all sessions with sessionId, sessionName, gameName, and timestamp fields
    const sessions = await Session.find(
      {},
      "sessionId sessionName gameName timestamp"
    );

    // Map to create an array of objects with sessionId, sessionName, gameName, and formatted timestamp
    const sessionData = sessions.map((session) => {
      const date = new Date(session.timestamp);
      return {
        sessionId: session.sessionId,
        sessionName: session.sessionName,
        gameName: session.gameName || "N/A", // Include gameName
        timestamp: [
          date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
        ],
      };
    });

    res.status(200).json(sessionData);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// Endpoint to check if analysis exists for a session
router.post("/sessions/analyze/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Fetch the session from the database
    const session = await Session.findOne({ sessionId: sessionId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if analysis results already exist in the database
    if (session.modelResponse && session.modelResponse.length > 0) {
      // If analysis results are already present, skip sending images to the model
      console.log("Analysis already exists for this session");
      return res.status(200).json({
        message: "Analysis already exists for this session",
        analysisResults: session.modelResponse, // Return the existing analysis
      });
    }

    // If no analysis exists, fetch images for analysis
    const { imagePaths = [] } = await getSessionMedia(sessionId);
    console.log(
      "this is the image paths that are being send to the model for analysis",
      imagePaths
    );

    if (!imagePaths || imagePaths.length === 0) {
      return res
        .status(400)
        .json({ message: "No images available for analysis" });
    }

    const analysisResults = [];
    console.log("before for loop of analyzing the images");

    // Process images and send them to the model for analysis
    for (const imagePath of imagePaths) {
      try {
        console.log(`Processing image: ${imagePath}`);

        // Read the image as a buffer
        const imageBuffer = fs.readFileSync(imagePath);
        // console.log("this is imageBuffer i guess", imageBuffer);

        // Call the helper function to send the image to the Hugging Face model
        const modelResult = await sendImageToModel(imageBuffer);
        console.log(modelResult);
        analysisResults.push(modelResult); // Add the analysis result to the array
      } catch (error) {
        console.error(`Failed to process image ${imagePath}:`, error.message);
        continue; // Continue processing other images even if one fails
      }
    }

    // After processing all images, save the analysis results
    console.log("Saving analysis results...");
    const saveResponse = await saveAnalysisResults(sessionId, analysisResults);

    if (saveResponse.success) {
      console.log("Results saved:", saveResponse.session);
    } else {
      console.log("Failed to save results:", saveResponse.message);
    }

    // Refresh the session data after saving results to ensure the latest analysis is fetched
    const updatedSession = await Session.findOne({ sessionId: sessionId });

    // Return the newly collected analysis results
    return res.status(200).json({
      analysisResults: updatedSession.modelResponse || [],
      message: "Analysis completed and results saved.",
    });
  } catch (error) {
    console.error("Error analyzing images:", error);
    return res.status(500).json({ message: "Error analyzing images" });
  }
});

// Get images for a specific session ID
router.get("/sessions/media/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    // Fetch the session by sessionId from MongoDB
    const session = await Session.findOne({ sessionId: sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Return imagePaths and screenshotPaths
    res.status(200).json({
      imagePaths: session.imagePaths,
      //screenshotPaths: session.screenshotPaths
    });
    console.log("images sent");
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// API to get all sessions
router.get("/detailed_sessions/:sessionId", async (req, res) => {
  console.log("detailed analysis ");
  const { sessionId } = req.params;
  try {
    const sessionData = await Session.findOne({ sessionId }); // Adjust based on your schema
    if (!sessionData) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(sessionData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching session data" });
  }
});

router.get("/sessions/analysis/:sessionId", async (req, res) => {
  console.log("hi hi");
  const { sessionId } = req.params;
  try {
    // Find the session by sessionId
    const session = await Session.findOne({ sessionId });
    console.log(session);
    if (!(session.modelResponse.length === session.imagePaths.length)) {
      console.log("not equal");
    }
    // Check if session or modelResponse exist
    if (
      !session ||
      !session.modelResponse ||
      session.modelResponse.length === 0 ||
      !(session.modelResponse.length === session.imagePaths.length)
    ) {
      // Return 404 if no analysis data is available or the array is empty
      console.log("not found ");
      return res
        .status(404)
        .json({ message: "No analysis found for this session" });
    }

    // Send back the existing analysis results
    res.status(200).json({ analysisResults: session.modelResponse });
  } catch (error) {
    console.error("Error checking for analysis:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to fetch all data related to a session by ID in overallAnalysis.js
router.get("/sessions/:sessionId", async (req, res) => {
  console.log("Fetching session data for overall analysis");
  const { sessionId } = req.params;
  console.log(sessionId);

  try {
    // Fetch session data by sessionId from MongoDB
    const sessionData = await Session.findOne({ sessionId }, "modelResponse"); // Only fetch the modelResponse field
    console.log(sessionData);

    if (!sessionData) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Return only the modelResponse array
    res.status(200).json(sessionData.modelResponse);
  } catch (error) {
    console.error("Error fetching session data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
