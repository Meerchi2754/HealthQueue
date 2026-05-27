import prisma from "@/lib/prisma";

export async function createPayment(
  appointmentId: number,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  amount: number,
  currency: string,
) {
  const [payment] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        appointmentId,
        razorpayOrderId,
        razorpaySignature,
        razorpayPaymentId,
        amount,
        currency,
      },
    }),
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { paymentStatus: "PAID" },
    }),
  ]);

  return payment;
}
