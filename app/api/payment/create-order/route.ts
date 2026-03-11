import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getDoctorName from "@/services/getDoctorName";

import { Gender, PaymentMethod } from "@/app/generated/prisma/enums";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const {
      doctorId,
    }: {
      doctorId: number;
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
    });
    // const payment = {
    //   create: {
    //     razorpayOrderId: order.id,
    //     amount: amountInPaise,
    //   },
    // };
    // const appointment = await createAppointment(
    //   patientId,
    //   doctorId,
    //   slotTime,
    //   date,
    //   gender,
    //   paymentMethod,
    // );

    // //Intialise PAYMENT Model
    // const payment = await createPayment(
    //   appointment.id,
    //   order.id,
    //   amountInPaise,
    //   order.currency,
    // );
    // if (!payment) {
    //   return NextResponse.json(
    //     { error: "Payment Table not Initailised" },
    //     { status: 400 },
    //   );
    // }
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
