import crypto from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { createAppointment } from "@/services/users/createAppointment";
import { createPayment } from "@/services/payment/createPayment";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount,
      currency,
    } = await req.json();

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    // const appointment = await createAppointment(
    //   patientId,
    //   patientName,
    //   doctorId,
    //   slotTime,
    //   date,
    //   gender,
    //   paymentMethod,
    // );
    // if (!appointment) {
    //   return NextResponse.json(
    //     { message: "Appointment Not Created" },
    //     { status: 400 },
    //   );
    // }
    // console.log("APPOINTMENT CREATED");

    // ✅ CREATE PAYMENT
    // const payment = await createPayment(
    //   appointment.id,
    //   razorpayOrderId,
    //   razorpayPaymentId,
    //   razorpaySignature,
    //   amount,
    //   currency,
    // );
    // console.log("PAYMENT CREATED");
    // if (!payment) {
    //   return NextResponse.json(
    //     { message: "Payment Not Created" },
    //     { status: 400 },
    //   );
    // }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
