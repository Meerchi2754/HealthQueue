import prisma from "@/lib/prisma";

export async function Appointment() {
  const response = await prisma.appointment.findMany({
    omit: {
      id: true,
      usersId: true,
      patientId: true,
    },
  });
  return response;
}
