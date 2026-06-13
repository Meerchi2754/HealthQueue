import { getAppointments } from "@/services/clinic/appointment";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const getAllAppointment = await getAppointments();
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
