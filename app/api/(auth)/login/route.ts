import { createToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/validation/loginFormSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const response = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          error: "User Not Found",
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
    response.password = "";
    const token = createToken({
      id: response.id,
      email: response.email,
      role: response.role,
    });

    const res = NextResponse.json(
      { message: "Login Successful", data: response },
      { status: 200 },
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 7,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
