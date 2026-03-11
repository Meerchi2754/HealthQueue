import prisma from "@/lib/prisma";
export async function getAllDoctor() {
  const res = await prisma.users.findMany({
    where: {
      role: "DOCTOR",
    },
    select: {
      name: true,
      email: true,
      phonenumber: true,
      doctorDetails: {
        select: {
          doctorId: true,
          speciality: true,
          degree: true,
          timeSlot: true,
          startTime: true,
          endTime: true,
          isAvailable: true,
        },
      },
    },
  });
  return res;
}
