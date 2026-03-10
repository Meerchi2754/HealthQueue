import cryto from "crypto";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      appointmentId,
    } = await req.json();

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = cryto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    await prisma.payment.update({
      where: {
        appointmentId: appointmentId,
      },
      data: {
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature,
        status: "PAID",
      },
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        paymentStatus: "PAID",
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
  }
}
