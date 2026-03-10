import prisma from "@/lib/prisma";
export async function historyAppointment(userId: number) {
  const response = await prisma.appointment.findMany({
    where: {
      patientId: userId,
    },
    omit: {
      id: true,
      gender: true,
      createdAt: true,
      usersId: true,
    },
  });
  return response;
}
