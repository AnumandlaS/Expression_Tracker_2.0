const express = require("express");
const app = express();
const path = require("path");
const connectToDB = require("./db_connection"); // Import the db connection
const { Session, UserAuth, Game } = require("./schema");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const childRouter = require("./routes/child");
const adminRouter = require("./routes/admin");
require("dotenv").config(); // Load environment variables
app.use(bodyParser.json());

// Allow requests from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/child", childRouter);
app.use("/admin", adminRouter);

// Get the next available child name based on the current highest ChildXXX
app.get("/next-child", async (req, res) => {
  try {
    // Query the database for all session names that match the pattern 'ChildXXX'
    const sessions = await Session.find({ sessionName: /^Child\d{3}$/ }).select(
      "sessionName -_id"
    );

    let nextChildNum = 1; // Default to 'Child001' if no sessions exist

    if (sessions.length > 0) {
      // Extract the numeric part from each 'ChildXXX' session name
      const childNumbers = sessions.map((session) =>
        parseInt(session.sessionName.replace("Child", ""), 10)
      );

      // Get the maximum number found
      const maxChildNum = Math.max(...childNumbers);

      // Increment the max number by 1 for the next available child name
      nextChildNum = maxChildNum + 1;
    }

    const nextChildName = `Child${nextChildNum.toString().padStart(3, "0")}`;
    res.status(200).json({ nextChildName });
  } catch (error) {
    console.error("Error fetching next child name:", error);
    res.status(500).json({ error: "Failed to fetch next child name" });
  }
});
// admin
// where did we use this ???????????????????//

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve uploaded screenshots
app.use("/screenshots", express.static(path.join(__dirname, "screenshots")));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  try {
    await connectToDB(); // Establish the MongoDB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
})();

app.get("/", cors(), (req, res) => {
  res.status(200).json("Home works!");
});
app.get("/blah", cors(), (req, res) => {
  res.status(200).json("blah works!");
});

// Backend Route to Fetch Sessions with Search
app.get("/sessions", async (req, res) => {
  const { searchTerm } = req.query; // Get search term from query parameter

  try {
    // Search for sessions where sessionName or gameName contains the search term
    const sessions = await Session.find({
      $or: [
        { sessionName: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search
        { gameName: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.json(sessions); // Return matching sessions
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// where did we use this endpoint in frontend??????????????

// Sample user insertion (commented out for production)
// async function insertSampleUsers() {
//     const users = [
//         { username: 'admin', password: 'adminpass', role: 'admin' },
//         { username: 'child1', password: 'childpass1', role: 'child' },
//         { username: 'child2', password: 'childpass2', role: 'child' },
//         { username: 'child3', password: 'childpass4', role: 'child' }
//     ];
//     for (const user of users) {
//         const hashedPassword = await bcrypt.hash(user.password, 10);
//         const newUser = new UserAuth({ username: user.username, password: hashedPassword, role: user.role });
//         await newUser.save();
//       }
//       console.log('Sample users inserted');
// }

// Password update function (commented out for production)
// const saltRounds = 10;
// async function updatePassword(username, newPassword) {
//   const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
//   await UserAuth.updateOne({ username: username }, { $set: { password: hashedPassword } });
//   console.log(`Password for ${username} updated successfully`);
// }
// updatePassword("child2", "childpa2");

app.post("/adminlogin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserAuth.findOne({ username: username });
    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Check user role and send appropriate response
    if (user.role === "admin") {
      return res
        .status(200)
        .json({ message: "Welcome, Admin!", redirectTo: "/analysis" });
    } else if (user.role === "child") {
      return res
        .status(200)
        .json({ message: "Welcome, Child!", redirectTo: "/select-game" });
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Uncomment to insert sample users
// insertSampleUsers();

// app.get("/game/:gameId", async (req, res) => {
//   const { gameId } = req.params;
//   try {
//     const game = await Game.findOne({ gameId });
//     if (!game) return res.status(404).json({ message: "Game not found" });

//     res.json(game.questions); // Return only questions
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching game questions", error });
//   }
// });
// const game1Questions = [
//   {
//     question: "Guess the correct spelling",
//     image: "images/baby.jpeg",
//     answers: [
//       { text: "baby", correct: true },
//       { text: "bady", correct: false },
//       { text: "dady", correct: false },
//       { text: "daby", correct: false },
//     ],
//   },
//   {
//     question: "Guess the spelling correctly",
//     image: "images/cat.jpeg",
//     answers: [
//       { text: "cat", correct: true },
//       { text: "kat", correct: false },
//     ],
//   },
//   {
//     question: "Which of the two is correct ???",
//     image: "images/q3.jpeg.jpg",
//     answers: [
//       { text: "A", correct: true },
//       { text: "B", correct: false },
//     ],
//   },
//   {
//     question: "What is the boy doing ???",
//     image: "images/swimming.jpg",
//     answers: [
//       { text: "SWIMMING", correct: true },
//       { text: "SWIMMMING", correct: false },
//     ],
//   },
//   {
//     question: "Guess the spelling correctly",
//     image: "images/hat.jpg",
//     answers: [
//       { text: "nat", correct: false },
//       { text: "hat", correct: true },
//     ],
//   },
// ];
// const game2Questions = [
//   {
//     word: "App_e",
//     image: "images_2/apple.png",
//     correctLetter: "l",
//     options: ["s", "l", "k", "j"],
//   },
//   {
//     word: "_at",
//     image: "images_2/bat.avif",
//     correctLetter: "b",
//     options: ["d", "p", "b", "q"],
//   },
//   {
//     word: "Do_",
//     image: "images_2/dog.jpg",
//     correctLetter: "g",
//     options: ["g", "d", "b", "p"],
//   },
//   {
//     word: "_at",
//     image: "images_2/cat.jpg.crdownload",
//     correctLetter: "c",
//     options: ["k", "a", "c", "b"],
//   },
// ];

// const newGame = new Game({
//   gameId: "game-1", // You can set this dynamically
//   name: "Quiz", // Name of the game
//   questions: game1Questions, // Add the relevant question set (game1Questions or game2Questions)
// });

// // Save the game document to the database
// newGame
//   .save()
//   .then(() => {
//     console.log("Game created and questions added successfully!");
//   })
//   .catch((err) => {
//     console.log("Error adding game:", err);
//   });

// const newGame2 = new Game({
//   gameId: "game-2", // Game ID
//   name: "Letter Fill-in Game", // Name of the game
//   questions: game2Questions, // Add the relevant question set (game2Questions)
// });

// // Save the second game
// newGame2
//   .save()
//   .then(() => {
//     console.log("Game 2 created and questions added successfully!");
//   })
//   .catch((err) => {
//     console.log("Error adding game 2:", err);
//   });
