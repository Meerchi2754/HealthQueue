import { changeAvailable } from "@/services/changeAvailable";
import { verifyCookie } from "@/utils/verifyCookie";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const user = await verifyCookie();
    const { role, id } = user;
    if (role !== "DOCTOR") {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 401 },
      );  
    }

    const body = await req.json();
    const { isAvailable } = body;
    const updateOrNot = await changeAvailable(id, isAvailable);
    if (!updateOrNot) {
      return NextResponse.json(
        {
          message: "Availability Not Changed",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ data: updateOrNot }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
