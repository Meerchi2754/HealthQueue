import prisma from "@/lib/prisma";
export async function historyAppointment(userId: number) {
  const response = await prisma.appointment.findMany({
    where: {
      patientId: userId,
    },
    include: {
      doctor: {
        select: {
          name: true,
        },
      },
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
