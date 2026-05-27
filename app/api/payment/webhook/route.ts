import prisma from "@/lib/prisma";
import { createAppointment } from "@/services/users/createAppointment";
import { log } from "console";
import crypto from "crypto";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Read raw body & verify signature
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { message: "Signature missing." },
        { status: 400 },
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { message: "Invalid Signature" },
        { status: 400 },
      );
    }

    const body = JSON.parse(rawBody);
    const event = body.event;

    if (!["payment.captured", "payment.failed"].includes(event)) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 3. Extract order_id
    const paymentEntity = body?.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID not found." },
        { status: 400 },
      );
    }

    if (event === "payment.captured") {
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
      });

      if (payment) {
        if (payment.status === "PAID") {
          log("APPOINTMENT CREATED?");
          const {
            slotTime,
            date,
            patientId,
            patientName,
            doctorId,
            gender,
            paymentMethod,
            currency,
          } = paymentEntity.notes;

          await prisma.$transaction(async (tx) => {
            const appointment = await createAppointment(
              Number(patientId),
              patientName,
              Number(doctorId),
              slotTime,
              date,
              gender,
              paymentMethod,
            );

            await tx.payment.create({
              data: {
                appointmentId: appointment.id,
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentEntity.id,
                amount: paymentEntity.amount,
                currency,
                status: "PAID",
              },
            });
          });

          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: { status: "PAID", razorpayPaymentId: paymentEntity.id },
            }),
            prisma.appointment.update({
              where: { id: payment.appointmentId! },
              data: { paymentStatus: "PAID" },
            }),
          ]);
          console.log("PAYMENT STATUS: PAID");
          return NextResponse.json({ received: true }, { status: 200 });
        } else {
          console.log("NOT PAID");
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
