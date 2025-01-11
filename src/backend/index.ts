import express from "express";
import dotenv from "dotenv";
import TaskRoutes from "./src/routes/TaskRoutes";
import "./src/scheduler/TaskScheduler";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api", TaskRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
