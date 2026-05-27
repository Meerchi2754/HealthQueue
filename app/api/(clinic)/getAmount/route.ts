import revenueConfirm from "@/services/clinic/revenueConfirm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const revenue = await revenueConfirm();
    if (!revenue) {
      return NextResponse.json(
        { message: "Unable to fetch Revenue" },
        { status: 400 },
      );
    }
    const allsum = revenue._sum.amount! / 100;
    return NextResponse.json({ data: allsum }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
