import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY as string,
});

/**
 * Generates a new task using OpenAI
 * @returns A new task string or null if there's an error
 */
export const generateTask = async (): Promise<string | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a task generator." },
        {
          role: "user",
          content: "Generate a daily picture task for a user. Keep it short.",
        },
      ],
    });

    const task = response.choices[0].message.content;
    return task || null;
  } catch (error) {
    console.error("Error generating task with OpenAI:", error);
    return null;
  }
};
