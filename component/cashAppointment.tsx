import { Gender, PaymentMethod } from "@/app/generated/prisma/enums";
import { createAppointment } from "@/services/createAppointment";
export async function cashAppointment(
  userId: number,
  doctorId: number,
  slot: string,
  date: string,
  gender: Gender,
  paymentMethod: PaymentMethod,
) {
  const appointment = createAppointment(
    userId!,
    doctorId,
    slot,
    date,
    gender,
    paymentMethod,
  );
  return appointment;
}
