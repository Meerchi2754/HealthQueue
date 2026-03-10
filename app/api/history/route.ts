import { historyAppointment } from "@/services/history/historyAppointment";
import { verifyCookie } from "@/utils/verifyCookie";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyCookie();
    if (user.role !== "PATIENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const history = await historyAppointment(user.id);
    return NextResponse.json({ data: history }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
