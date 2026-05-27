import { Gender, PaymentMethod } from "@/prisma/generated/prisma/enums";

import prisma from "@/lib/prisma";

export async function createAppointment(
  patientId: number,
  patientName: string,
  doctorId: number,
  slotTime: string,
  date: string,
  gender: Gender,
  paymentMethod: PaymentMethod,
) {
  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      doctorId,
      patientName,
      paymentMethod,
      slotTime,
      date,
      status: "PENDING",
      gender: gender,
    },
  });

  return appointment;
}
