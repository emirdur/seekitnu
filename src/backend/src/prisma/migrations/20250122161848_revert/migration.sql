-- DropForeignKey
ALTER TABLE "UserLike" DROP CONSTRAINT "UserLike_imageId_fkey";

-- AddForeignKey
ALTER TABLE "UserLike" ADD CONSTRAINT "UserLike_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
