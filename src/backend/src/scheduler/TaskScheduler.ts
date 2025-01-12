import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cron job that runs every day at 11 PM
cron.schedule("27 23 * * *", async () => {
  try {
    console.log("Adding new task at 11:27 PM");

    await prisma.task.create({
      data: {
        content: "Daily task added at 11:27 PM",
      },
    });

    console.log("Task added successfully!");
  } catch (error) {
    console.error("Error adding task:", error);
  }
});
