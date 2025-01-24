import express from "express";
import cors from "cors";
import path from "path";
import ImageRoutes from "./src/routes/ImageRoutes";
import UserRoutes from "./src/routes/UserRoutes";
import TaskRoutes from "./src/routes/TaskRoutes";
import RankingRoutes from "./src/routes/RankingRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/tasks", TaskRoutes);
app.use("/api/images", ImageRoutes);
app.use("/api/leaderboard", RankingRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
