import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import getDoctorName from "@/services/users/getDoctorName";
import { PaymentMethod, Gender } from "@/prisma/generated/prisma/enums";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const {
      doctorId,
      slotTime,
      date,
      patientId,
      patientName,
      gender,
      paymentMethod,
      amount,
      currency,
    }: {
      doctorId: number;
      slotTime: string;
      date: string;
      patientId: number;
      patientName: string;
      gender: Gender;
      paymentMethod: PaymentMethod;
      amount: number;
      currency: string;
    } = await req.json();

    const doctor = await getDoctorName(doctorId);
    if (!doctor.fees) {
      return NextResponse.json(
        { error: "DOCTOR FEES NOT FOUND" },
        { status: 400 },
      );
    }
    console.log(doctor.fees);

    const amountInPaise = doctor.fees * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        slotTime,
        date,
        patientId,
        patientName,
        doctorId,
        gender,
        paymentMethod,
        amount,
        currency,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      //appointmentId: appointment.id,
    });
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);
    return NextResponse.json(
      { error: "ORDER CREATION FAILED", details: error },
      { status: 500 },
    );
  }
}
