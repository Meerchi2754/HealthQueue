import prisma from "@/lib/prisma";

export async function createPayment(
  appointmentId: number,
  razorpayOrderId: string,
  amount: number,
  currency: string,
) {
  const responseCP = await prisma.payment.create({
    data: {
      appointmentId,
      razorpayOrderId: razorpayOrderId,
      amount: amount!,
      currency: currency!,
    },
  });
  return responseCP;
}
