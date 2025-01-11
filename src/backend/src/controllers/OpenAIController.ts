import { openai } from "../services/OpenAIConfig";
import prisma from "../prisma/prisma";

export const generateTask = async (prompt: string): Promise<string> => {
  const errMsg = "No task today. Go crazy!";
  try {
    const taskResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    if (taskResponse.choices && taskResponse.choices.length > 0) {
      const task = taskResponse.choices[0].message?.content;

      if (task) {
        await prisma.task.create({
          data: {
            task: task.trim(),
          },
        });

        return task.trim();
      } else {
        throw new Error("OpenAI Task Generation Error.");
      }
    } else {
      throw new Error("OpenAI Response Error.");
    }
  } catch (error) {
    return errMsg;
  }
};
