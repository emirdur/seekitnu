import React, { useState, useEffect } from "react";

const Task = () => {
  const [task, setTask] = useState<string>(""); // Store the task
  const [loading, setLoading] = useState<boolean>(true); // Manage loading state
  const [error, setError] = useState<string | null>(null); // Handle any error

  // Fetch the task from the backend on component mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true); // Set loading state to true
        const response = await fetch("/api/get-task"); // API call to fetch task from the database

        if (response.ok) {
          const data = await response.json(); // Get the task data from the response
          setTask(data.task); // Store the task in the state
        } else {
          throw new Error(`Error fetching task: ${response.statusText}`); // Throw error if response is not ok
        }
      } catch (error) {
        setError("Failed to load task."); // Set error message if an error occurs
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false); // Set loading state to false after the fetch attempt
      }
    };

    fetchTask(); // Call the fetchTask function when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  // Handle different states (loading, error, and task display)
  if (loading) {
    return <p>Loading task...</p>; // Show loading message while fetching
  }

  if (error) {
    return <p>{error}</p>; // Show error message if fetching fails
  }

  return (
    <>
      <h1 className="upload-title">{task || "No task available"}</h1>{" "}
      {/* Display the task or a fallback message */}
    </>
  );
};

export default Task;
