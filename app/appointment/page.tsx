"use client";
import { useEffect, useState } from "react";
import { Doctor } from "@/types";
import { useRouter } from "next/navigation";
import { verifyCookie } from "@/utils/verifyCookie";
import { Navbar } from "@/component/navbar";

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlot, setTimeSlot] = useState([]);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/doctorname")
      .then((res) => res.json())
      .then((data) => setDoctors(data.data));

    fetch("/api/slot")
      .then((res) => res.json())
      .then((data) => setTimeSlot(data.data));
  }, []);

  const generateSlots = (start: number, end: number) => {
    const slots = [];
    for (let i = start; i < end; i++) {
      slots.push(`${i}:00 - ${i + 1}:00`);
    }
    return slots;
  };

  //handleOnClick
  const handleClick = async (doctorId:Number, slot:string) => {
    const user = await verifyCookie();
    if (!user.role || user.role !== "PATIENT") {
      router.push("/login");
    }
    router.push(
      `/appointment/booking?doctorId=${doctorId}&slot=${encodeURI(slot)}`,
    );
  };

  return (
    <>
      <Navbar></Navbar>

      {timeSlot.map((slot: any) => {
        const doctor = doctors.find((d: any) => d.id === slot.doctorId);

        if (!doctor) return null;

        const slots = generateSlots(slot.startTime, slot.endTime);

        return (
          <div key={slot.doctorId} style={{ marginBottom: "20px" }}>
            <h3>
              {doctor.name} : {slot.speciality}
            </h3>

            {slots.map((s, index) => (
              <button
                key={index}
                style={{
                  margin: "5px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: "white",
                  color: "black",
                }}
                onClick={()=>handleClick(slot.doctorId, s)}
              >
                {s}
              </button>
            ))}
          </div>
        );
      })}
    </>
  );
}
