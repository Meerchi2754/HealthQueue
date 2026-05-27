import { Gender, PaymentMethod } from "@/prisma/generated/prisma/enums";
import { createAppointment } from "@/services/users/createAppointment";

/**
 * Creates a cash payment appointment
 * Cash appointments are created with PENDING status and require clinic confirmation
 */
export async function cashAppointment(
  userId: number,
  patientName: string,
  doctorId: number,
  slot: string,
  date: string,
  gender: Gender,
  paymentMethod: PaymentMethod,
) {
  const appointment = await createAppointment(
    userId,
    patientName,
    doctorId,
    slot,
    date,
    gender,
    paymentMethod,
  );
  return appointment;
}
