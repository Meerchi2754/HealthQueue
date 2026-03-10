import { Gender, PaymentMethod } from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";
import getDoctorName from "./getDoctorName";

export async function createAppointment(
  patientId: number,
  doctorId: number,
  slotTime: string,
  date: string,
  gender: Gender,
  paymentMethod: PaymentMethod,
) {
  const patientName = (await getDoctorName(patientId)).name;

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
