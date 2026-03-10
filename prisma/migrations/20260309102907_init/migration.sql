-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'ADMIN', 'DOCTOR', 'CLINIC');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phonenumber" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorDetails" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "speciality" TEXT,
    "fees" INTEGER,
    "degree" TEXT,
    "timeSlot" TEXT,
    "startTime" TIMESTAMP(3),
    "EndTime" TIMESTAMP(3),
    "isAvailable" BOOLEAN,

    CONSTRAINT "DoctorDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorDetails_doctorId_key" ON "DoctorDetails"("doctorId");

-- AddForeignKey
ALTER TABLE "DoctorDetails" ADD CONSTRAINT "DoctorDetails_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
