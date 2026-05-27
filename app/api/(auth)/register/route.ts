import prisma from "@/lib/prisma";
import { registerSchema } from "@/validation/registerFormSchema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, role } = body;


    const validationResult = registerSchema.safeParse({
      name,
      email,
      password,
    });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
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
          { error: "Doctor Detail has not been created!" },
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
