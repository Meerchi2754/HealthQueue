import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await prisma.appointment.findMany({
      where: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
      select: {
        id: true,
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching paid appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch paid appointments" },
      { status: 500 }
    );
  }
}
