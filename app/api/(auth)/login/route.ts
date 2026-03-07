import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and Password required" },
        { status: 400 },
      );
    }

    const response = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          message: "User Not Found",
        },
        {
          status: 401,
        },
      );
    }
    const isMatch = await bcrypt.compare(password, response.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }
    const { password: _, ...rest } = response;

    return NextResponse.json(
      { message: "Login Successfull", data: rest },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
