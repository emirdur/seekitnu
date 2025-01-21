import { useState, useEffect } from "react";
import "./TaskComponent.css";

export const TaskComponent = () => {
  const [task, setTask] = useState<string | null>(null); // Allow `null` for task
  const [loading, setLoading] = useState<boolean>(true); // Start with loading state
  const [error, setError] = useState<string | null>(null); // Hold any error messages

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tasks/fetchTask",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the daily task");
        }
        const data = await response.json();
        setTask(data.task); // Update task with fetched data
      } catch (err) {
        console.error("Error fetching daily task:", err);
        setError("Unable to load today's task."); // Set error if fetch fails
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchTask();
  }, []);

  if (loading) {
    return <h1 className="upload-title">Loading task...</h1>;
  }

  if (error) {
    return <h1 className="upload-title">{error}</h1>;
  }

  return (
    <>
      <h1 className="upload-title">{task || "No task today. Go crazy!"}</h1>
    </>
  );
};
