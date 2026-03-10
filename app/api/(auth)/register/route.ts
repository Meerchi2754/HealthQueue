import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Email, Name and Password required" },
        { status: 400 },
      );
    }
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const response = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
      },
      omit: { password: true },
    });

    let initaliseDoctorDetails = null;
    if (role === "DOCTOR") {
      initaliseDoctorDetails = await prisma.doctorDetails.create({
        data: {
          doctorId: response.id,
        },
      });
      if (!initaliseDoctorDetails) {
        return NextResponse.json(
          { message: "Doctor Detail has not been created!" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ data: response }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error },
      { status: 500 },
    );
  }
}
