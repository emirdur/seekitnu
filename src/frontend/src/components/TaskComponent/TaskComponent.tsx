import { useState, useEffect } from "react";
import "./TaskComponent.css";
import { useToast } from "../../contexts/ToastContext";

export const TaskComponent = () => {
  const [task, setTask] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tasks/fetchTask",
        );
        if (!response.ok) {
          showToast("Unable to load today's task.", "danger");
          return;
        }
        const data = await response.json();
        setTask(data.task);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, []);

  if (loading) {
    return <h1 className="upload-title">Loading task...</h1>;
  }

  return (
    <>
      <h1 className="upload-title">{task || "No task today. Go crazy!"}</h1>
    </>
  );
};
