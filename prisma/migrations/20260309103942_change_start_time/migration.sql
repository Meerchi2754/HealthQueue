/*
  Warnings:

  - The `startTime` column on the `DoctorDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `EndTime` column on the `DoctorDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DoctorDetails" DROP COLUMN "startTime",
ADD COLUMN     "startTime" INTEGER,
DROP COLUMN "EndTime",
ADD COLUMN     "EndTime" INTEGER;
