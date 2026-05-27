import { NextRequest, NextResponse } from "next/server";
import { cashAppointment } from "@/component/cashAppointment";
import { Gender, PaymentMethod } from "@/prisma/generated/prisma/enums";
import { verifyCookie } from "@/utils/verifyCookie";

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const user = await verifyCookie();
    if (!user || user.role !== "PATIENT") {
      return NextResponse.json(
        { error: "Unauthorized. Only patients can book appointments." },
        { status: 401 }
      );
    }

    const {
      patientName,
      doctorId,
      slotTime,
      date,
      gender,
      paymentMethod,
    }: {
      patientName: string;
      doctorId: number;
      slotTime: string;
      date: string;
      gender: Gender;
      paymentMethod: PaymentMethod;
    } = await req.json();

    // Validate required fields
    if (!patientName || !doctorId || !slotTime || !date || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate patient name length
    if (patientName.length < 4 || patientName.length > 12) {
      return NextResponse.json(
        { error: "Patient name must be between 4 and 12 characters" },
        { status: 400 }
      );
    }

    // Validate payment method is cash
    if (paymentMethod !== PaymentMethod.cash) {
      return NextResponse.json(
        { error: "This endpoint is only for cash payments" },
        { status: 400 }
      );
    }

    // Create cash appointment
    const appointment = await cashAppointment(
      user.id,
      patientName,
      doctorId,
      slotTime,
      date,
      gender,
      paymentMethod
    );

    return NextResponse.json(
      {
        success: true,
        message: "Cash appointment created successfully. Awaiting clinic confirmation.",
        appointment: {
          id: appointment.id,
          status: appointment.status,
          paymentStatus: appointment.paymentStatus,
          date: appointment.date,
          slotTime: appointment.slotTime,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating cash appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment", details: error },
      { status: 500 }
    );
  }
}
