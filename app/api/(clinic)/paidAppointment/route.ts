import prisma from "@/lib/prisma";

export  async function GET() {
  const res = await prisma.appointment.findMany({
    where: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
    },
    select: {
      id: true,
    },
  });
  return res;
}
