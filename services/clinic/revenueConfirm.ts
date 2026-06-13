import {
  PaymentStatus,
  AppointmentStatus,
} from "@/prisma/generated/prisma/enums";
import prisma from "@/lib/prisma";

export async function revenueConfirm() {
  const revenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
      appointment: {
        status: AppointmentStatus.CONFIRMED,
      },
    },
  });
  return revenue;
}
