import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const timeSlot = await prisma.doctorDetails.findMany({
    where: {
      isAvailable: true,
    },
    select: {
      doctorId: true,
      speciality: true,
      timeSlot: true,
      startTime: true,
      endTime: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return NextResponse.json({ data: timeSlot }, { status: 200 });
}
