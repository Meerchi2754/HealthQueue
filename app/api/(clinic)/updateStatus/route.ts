import { updateStatus } from "@/services/clinic/updateStatus";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    //Update APPOINTMENT STATUS:
    const res = await updateStatus(id, status);
    if (!res) {
      return NextResponse.json(
        { message: "Appointment Status Not Updated" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
