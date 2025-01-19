/*
  Warnings:

  - You are about to drop the column `userId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userFirebaseUid]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userFirebaseUid` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- DropIndex
DROP INDEX "Image_userId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "userId",
ADD COLUMN     "userFirebaseUid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_userFirebaseUid_key" ON "Image"("userFirebaseUid");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userFirebaseUid_fkey" FOREIGN KEY ("userFirebaseUid") REFERENCES "User"("firebaseUid") ON DELETE RESTRICT ON UPDATE CASCADE;
