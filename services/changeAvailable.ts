import prisma from "@/lib/prisma";

export async function changeAvailable(id: number, isAvailable: boolean) {
  const response = await prisma.doctorDetails.update({
    where: {
      doctorId: id,
    },
    data: {
      isAvailable,
    },
  });
  return response;
}
