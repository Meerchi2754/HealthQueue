import { Role } from "@/app/generated/prisma/enums";
import { Appointment } from "@/services/clinic/Appointment";
import { verifyCookie } from "@/utils/verifyCookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const getAllAppointment = await Appointment();
    if (!getAllAppointment) {
      return NextResponse.json(
        { message: "Failed to Fetch Appointment" },
        { status: 400 },
      );
    }
    return NextResponse.json({ data: getAllAppointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
