import prisma from "@/lib/prisma";

export async function getAppointments() {
  const response = await prisma.appointment.findMany({
    include: {
      doctor: {
        select: {
          name: true,
        },
      },
    },
    omit: {
      usersId: true,
      patientId: true,
    },
    orderBy: {
      date: "asc",
    },
  });
  return response;
}
