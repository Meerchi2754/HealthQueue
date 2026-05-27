import { BookingSearchParams } from "@/types";
import getDoctorName from "@/services/users/getDoctorName";
import { verifyCookie } from "@/utils/verifyCookie";
import BookingComponent from "@/component/booking";

export default async function Booking({
  searchParams,
}: {
  searchParams: BookingSearchParams;
}) {
  const user = await verifyCookie();
  const username = await getDoctorName(Number(user.id));
  const { doctorId, slot, date } = await searchParams;
  const doctorName = await getDoctorName(Number(doctorId));

  return (
    <>
      <BookingComponent
        doctorId={Number(doctorId)}
        slot={slot!}
        appDate={date!}
        doctorName={doctorName.name!}
        speciality={doctorName.speciality!}
        fees={doctorName.fees!}
        username={username?.name}
        userId={user.id}
      />
    </>
  );
}
