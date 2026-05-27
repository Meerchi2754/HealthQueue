"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyCookie } from "@/utils/verifyCookie";
import SubHeroSection from "@/component/subHeroSection";
import { AppointmentStatus } from "@/prisma/generated/prisma/enums";
import { toast } from "sonner";

export default function AppointmentPage() {
  const [timeSlot, setTimeSlot] = useState([]);
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isloading, setisLoading] = useState(true);
  const [error, setError] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    // Initialize dates on client side
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    setSelectedDate(todayStr);
    setMinDate(todayStr);
    
    const max = new Date();
    max.setDate(today.getDate() + 14);
    setMaxDate(max.toISOString().split("T")[0]);

    const fetchAll = async () => {
      try {
        const [slotRes, historyRes] = await Promise.all([
          fetch("/api/slot"),
          fetch("/api/getAllAppointment"),
        ]);

        if (!slotRes.ok || !historyRes.ok) {
          throw new Error("One or more requests failed");
        }

        const [slotData, historyData] = await Promise.all([
          slotRes.json(),
          historyRes.json(),
        ]);
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
        (ap: any) =>
          ap.doctorId === doctorId &&
          ap.slotTime === slot &&
          ap.date === selectedDate &&
          (ap.status === AppointmentStatus.CONFIRMED ||
            ap.status === AppointmentStatus.PENDING),
      );
      if (!isBooked) {
        slots.push(slot);
      }
    }
    return slots;
  };

  //handleOnClick
  const handleClick = async (doctorId: number, slot: string) => {
    const user = await verifyCookie();
    if (!user.role || user.role !== "PATIENT") {
      toast.error("Unauthorized");
      router.push("/login");
      return;
    }
    router.push(
      `/appointment/booking?doctorId=${doctorId}&slot=${encodeURIComponent(
        slot,
      )}&date=${encodeURIComponent(selectedDate)}`,
    );
  };

  return (
    <>
      <SubHeroSection
        title="BOOK YOUR APPOINTMENT"
        subheading="Choose a doctor and select an available time slot that works for you."
      />
      <div className="flex justify-center text-center gap-10 text-2xl text-blue-500 p-8">
        <p>AVAILABLE DOCTORS</p>
      </div>
      {isloading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        </div>
      )}

      {!isloading && (
        <div className="px-10 grid gap-6">
          <div className="justify-center">
            <div className="flex items-center gap-4 bg-white shadow p-4 rounded-lg">
              <label className="font-semibold text-black">Select Date:</label>

              <input
                type="date"
                value={selectedDate}
                min={minDate}
                max={maxDate}
                
                onChange={(e) => {
                  setSelectedDate(e.target.value)}}
                className="border rounded-md px-3 py-2"
              />
            </div>
          </div>
          {timeSlot.map((slot: any) => {
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
                <h3 className="text-xl font-bold text-blue-700">
                  {slot.user.name}
                </h3>
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
                        className="px-4 py-2 border rounded-md hover:bg-blue-600 hover:text-white transition cursor-pointer"
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
      )}
    </>
  );
}
