const taskPath = "./tasks.txt";

export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const fetchData = async (): Promise<string[]> => {
  const response = await fetch(taskPath); // Update with your actual file path or URL
  const content = await response.text();
  return content
    .split(/\r?\n/)
    .map((task) => task.trim())
    .filter(Boolean);
};

export const getTodaysTask = (tasks: string[]) => {
  const referenceDate = new Date(2025, 0, 1);

  const currentDate = new Date();

  const daysDifference = Math.floor(
    (currentDate.getTime() - referenceDate.getTime()) / (1000 * 3600 * 24)
  );

  const todayIndex = daysDifference % tasks.length;

  return tasks[todayIndex];
};

export const initializeStorage = async () => {
  const storedTasks = loadFromLocalStorage<string[]>("tasks");

  if (!storedTasks) {
    const fetchedData = await fetchData();
    saveToLocalStorage("tasks", fetchedData);
    return fetchedData;
  }

  return storedTasks;
};
