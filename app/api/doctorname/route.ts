import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const doctorName = await prisma.users.findMany({
    where: {
      role: "DOCTOR",
    },
    select: {
      id: true,
      name: true,
    },
  });
  return NextResponse.json({ data: doctorName }, { status: 200 });
}
