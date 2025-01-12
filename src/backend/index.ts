import express from "express";
import cors from "cors"; // If you need it for cross-origin requests
import path from "path";
import ImageRoutes from "./src/routes/ImageRoutes"; // Assuming this path for Image Routes

const app = express();

// Middleware to parse JSON and handle static files
app.use(cors()); // if needed
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "uploads"))); // Serve the files from the uploads folder

// Set up routes for image uploading
app.use("/api", ImageRoutes);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
