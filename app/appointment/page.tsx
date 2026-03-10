"use client";
import { useEffect, useState } from "react";
import { Doctor } from "@/types";
import { useRouter } from "next/navigation";
import { verifyCookie } from "@/utils/verifyCookie";
import { Navbar } from "@/component/navbar";
import SubHeroSection from "@/component/subHeroSection";

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlot, setTimeSlot] = useState([]);
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isloading, setisLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [doctorRes, slotRes, historyRes] = await Promise.all([
          fetch("/api/doctorname"),
          fetch("/api/slot"),
          fetch("/api/history"),
        ]);

        if (!doctorRes.ok || !slotRes.ok || !historyRes.ok) {
          throw new Error("One or more requests failed");
        }

        const [doctorData, slotData, historyData] = await Promise.all([
          doctorRes.json(),
          slotRes.json(),
          historyRes.json(),
        ]);

        setDoctors(doctorData.data);
        setTimeSlot(slotData.data);
        setAppointments(historyData.data);
      } catch (error) {
        console.log(error);
        setError("Something went wrong while fetching data.");
      } finally {
        setisLoading(false);
      }
    };

    fetchAll();
  }, []);

  const generateSlots = (start: number, end: number, doctorId: number) => {
    const slots: string[] = [];
    for (let i = start; i < end; i++) {
      const slot = `${i}:00 - ${i + 1}:00`;
      const isBooked = appointments.some(
        (ap: any) => ap.doctorId === doctorId && ap.slotTime === slot,
      );
      if (!isBooked) {
        slots.push(slot);
      }
    }
    return slots;
  };

  //handleOnClick
  const handleClick = async (doctorId: Number, slot: string) => {
    const user = await verifyCookie();
    if (!user.role || user.role !== "PATIENT") {
      router.push("/login");
      return;
    }
    router.push(
      `/appointment/booking?doctorId=${doctorId}&slot=${encodeURI(slot)}`,
    );
  };

  return (
    <>
      <Navbar />
      <SubHeroSection
        title="BOOK YOUR APPOINTMENT"
        subheading="Choose a doctor and select an available time slot that works for you."
      />
      <div className="flex justify-center text-center gap-10 text-2xl text-blue-500 p-8">
        <p>AVAILABLE DOCTORS</p>
      </div>
      <div className="px-10 grid gap-6">
        {timeSlot.map((slot: any) => {
          const doctor = doctors.find((d: any) => d.id === slot.doctorId);

          if (!doctor) return null;

          const slots = generateSlots(
            slot.startTime,
            slot.endTime,
            slot.doctorId,
          );
          return (
            <div
              key={slot.doctorId}
              className="border rounded-lg p-6 shadow-sm bg-white border-amber-50"
            >
              <h3 className="text-xl font-bold text-blue-700">{doctor.name}</h3>
              <p className="text-shadow-zinc-500 mb-4 font-semibold">
                {slot.speciality}
              </p>
              {slots.length === 0 ? (
                <p style={{ color: "red" }}>No Slots Available</p>
              ) : (
                <div className="flex flex-wrap gap-5">
                  {slots.map((s, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 border rounded-md hover:bg-blue-600 hover:text-white transition"
                      onClick={() => handleClick(slot.doctorId, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
