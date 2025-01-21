-- CreateTable
CREATE TABLE "DailyTask" (
    "id" SERIAL NOT NULL,
    "task" TEXT NOT NULL,

    CONSTRAINT "DailyTask_pkey" PRIMARY KEY ("id")
);
