import prisma from "@/lib/prisma";

export async function createPayment(
  appointmentId: number,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  amount: number,
  currency: string,
) {
  const responseCP = await prisma.payment.create({
    data: {
      appointmentId,
      razorpayOrderId: razorpayOrderId,
      razorpaySignature: razorpaySignature,
      razorpayPaymentId: razorpayPaymentId,
      amount: amount!,
      currency: currency!,
    },
  });
  return responseCP;
}
