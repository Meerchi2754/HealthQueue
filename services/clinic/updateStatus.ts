import prisma from "@/lib/prisma";
import { AppointmentStatus } from "@/prisma/generated/prisma/enums";

export async function updateStatus(id: number, status: AppointmentStatus) {
  const response = await prisma.appointment.update({
    where: {
      id: id,
    },
    data: {
      status: status,
    },
    select: {
      id: true,
    },
  });
  return response;
}
