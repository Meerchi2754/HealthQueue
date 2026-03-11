import { getAllDoctor } from "@/services/users/getAllDoctor";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const allDoctor = await getAllDoctor();
    if (!allDoctor) {
      return NextResponse.json(
        { message: "Error to fetch Doctor Details." },
        { status: 400 },
      );
    }
    return NextResponse.json({ data: allDoctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
