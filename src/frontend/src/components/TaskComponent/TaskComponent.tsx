import React, { useState, useEffect } from "react";
import "./TaskComponent.css";

export const TaskComponent = () => {
  const [task, setTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const errTask = "No task today. Go crazy!";
  const loadTask = "Loading task...";

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setTask("No task today.");
        // const response = await fetch(
        //   "http://localhost:5000/api/tasks/get-task",
        // );

        // if (response.ok) {
        //   const data = await response.json();
        //   setTask(data.task);
        // } else {
        //   throw new Error(`Error fetching task: ${response.statusText}`);
        // }
      } catch (error) {
        setError("Failed to load task.");
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, []);

  if (loading) {
    return <h1 className="upload-title">{loadTask}</h1>;
  }

  if (error) {
    return <h1 className="upload-title">{errTask}</h1>;
  }

  return (
    <>
      <h1 className="upload-title">{task}</h1>
    </>
  );
};
