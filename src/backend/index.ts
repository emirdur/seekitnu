import express from "express";
import cors from "cors"; // For handling cross-origin requests
import path from "path";
import ImageRoutes from "./src/routes/ImageRoutes"; // Assuming this path for Image Routes
import UserRoutes from "./src/routes/UserRoutes"; // Add new routes for user-specific actions

const app = express();

// Middleware to parse JSON and handle static files
app.use(cors()); // Enable cross-origin requests
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "uploads"))); // Serve uploaded files

// Routes
app.use("/api/images", ImageRoutes); // Image routes
app.use("/users", UserRoutes); // User routes

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
