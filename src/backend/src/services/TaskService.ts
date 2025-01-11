export const fetchTask = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/get-task");
    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }

    const data = await response.json();
    return data.task || null;
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};
