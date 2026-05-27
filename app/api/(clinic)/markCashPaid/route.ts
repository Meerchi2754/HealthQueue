import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyCookie } from "@/utils/verifyCookie";

/**
 * API endpoint for clinic to mark cash appointments as paid
 * Only accessible by CLINIC role users
 */
export async function POST(req: NextRequest) {
  try {
    // Verify user is clinic staff
    const user = await verifyCookie();
    if (!user || user.role !== "CLINIC") {
      return NextResponse.json(
        { error: "Unauthorized. Only clinic staff can mark appointments as paid." },
        { status: 401 }
      );
    }

    const { appointmentId }: { appointmentId: number } = await req.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Fetch the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Verify it's a cash payment
    if (appointment.paymentMethod !== "cash") {
      return NextResponse.json(
        { error: "This appointment is not a cash payment" },
        { status: 400 }
      );
    }

    // Check if already paid
    if (appointment.paymentStatus === "PAID") {
      return NextResponse.json(
        { message: "Appointment is already marked as paid" },
        { status: 200 }
      );
    }

    // Update appointment payment status to PAID
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        paymentStatus: "PAID",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cash payment confirmed successfully",
        appointment: {
          id: updatedAppointment.id,
          paymentStatus: updatedAppointment.paymentStatus,
          status: updatedAppointment.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking cash appointment as paid:", error);
    return NextResponse.json(
      { error: "Failed to mark appointment as paid", details: error },
      { status: 500 }
    );
  }
}
