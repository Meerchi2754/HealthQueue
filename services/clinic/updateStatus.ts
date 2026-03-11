import prisma from "@/lib/prisma";
import { AppointmentStatus } from "@/app/generated/prisma/enums";

export default async  function UpdateStatus(id: number, status: AppointmentStatus) {
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
