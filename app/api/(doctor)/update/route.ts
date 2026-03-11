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

    const reqUser = verifyToken(token);

    if (reqUser.role !== "CLINIC") {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 401 },
      );
    }

    const { doctorId, isAvailable, startTime, endTime } = body;

    const timeSlot = `${startTime}:00-${endTime}:00`;
    const updatedDoctor = await prisma.doctorDetails.update({
      where: {
        doctorId: doctorId,
      },
      data: {
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
