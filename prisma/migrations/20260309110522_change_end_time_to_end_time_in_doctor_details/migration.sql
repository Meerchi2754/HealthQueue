/*
  Warnings:

  - You are about to drop the column `EndTime` on the `DoctorDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DoctorDetails" DROP COLUMN "EndTime",
ADD COLUMN     "endTime" INTEGER;
