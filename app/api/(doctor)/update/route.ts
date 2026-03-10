import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//UPDATE DOCTOR DETAILS
export async function PATCH(req: NextRequest) {
  try {
    // const cookie = await cookies();
    const body = await req.json();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Please Login" }, { status: 400 });
    }
    // const tokenValue = token?.value;
    const reqUser = verifyToken(token);

    if (reqUser.role !== "DOCTOR") {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 401 },
      );
    }

    const { speciality, fees, degree, isAvailable, startTime, endTime } = body;

    if (!speciality)
      return NextResponse.json(
        { message: "Speciality required" },
        { status: 400 },
      );
    if (fees === undefined)
      return NextResponse.json(
        { message: "Dr. Fees required" },
        { status: 400 },
      );
    if (!degree)
      return NextResponse.json(
        { message: "Dr. Degree required" },
        { status: 400 },
      );
    if (isAvailable === undefined)
      return NextResponse.json(
        { message: "Please provide Doctor Availability" },
        { status: 400 },
      );
    if (!startTime || !endTime)
      return NextResponse.json(
        { message: "TimeSlot  required" },
        { status: 400 },
      );
    console.log(reqUser);
    const timeSlot = `${startTime}:00-${endTime}:00`;
    const updatedDoctor = await prisma.doctorDetails.update({
      where: {
        doctorId: Number(reqUser.id),
      },
      data: {
        speciality,
        fees,
        degree,
        isAvailable,
        startTime,
        endTime,
        timeSlot,
      },
    });
    if (!updatedDoctor) {
      return NextResponse.json(
        { message: "Doctor is not Updated" },
        { status: 400 },
      );
    }
    return NextResponse.json({ data: updatedDoctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
