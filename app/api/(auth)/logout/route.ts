import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.json({ message: "Please Login" }, { status: 401 });
    }
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 },
    );
    response.cookies.delete("token");

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 400 });
  }
}
