import express from "express";
import cors from "cors"; // For handling cross-origin requests
import path from "path";
import ImageRoutes from "./src/routes/ImageRoutes"; // Assuming this path for Image Routes

const app = express();

// Middleware to parse JSON and handle static files
app.use(cors()); // Enable cross-origin requests if needed
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "uploads"))); // Serve the files from the uploads folder

// Routes
app.use("/api/images", ImageRoutes); // Image routes

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
