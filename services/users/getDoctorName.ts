import prisma from "@/lib/prisma";

export default async function getDoctorName(id: number) {
  const name = await prisma.users.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  });
  const doctorDetails = await prisma.doctorDetails.findUnique({
    where: {
      doctorId: id,
    },
    select: {
      fees: true,
      speciality: true,
    },
  });

  return {
    name: name?.name!,
    fees: doctorDetails?.fees!,
    speciality: doctorDetails?.speciality!,
  };
}
