/*
  Warnings:

  - The `degree` column on the `DoctorDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DoctorDetails" DROP COLUMN "degree",
ADD COLUMN     "degree" TEXT[];
