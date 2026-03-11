"use client";

import { ClinicAppointment } from "@/types";
import Revenue from "@/component/clinic/Revenue";
import { useEffect, useState } from "react";
import { AppointmentStatus } from "@/app/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<ClinicAppointment[]>([]);
  useEffect(() => {
    const getAllappointment = async () => {
      try {
        const response = await fetch("/api/getAllAppointment");
        const data = await response.json();
        setAppointment(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAllappointment();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });
      if (!res.ok) throw new Error("Failed");

      // ✅ Update UI instantly
      setAppointment((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as any } : a)),
      );
      toast.success("Appointment Status Updated");
      router.refresh();
    } catch (error) {
      console.log("Failed to Update Status.");
      toast.error("Appointment Status Not Updated");
      console.log(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <>
      <div className="flex flex-row gap-3 p-6 justify-center">
        <div>
          <Revenue />
        </div>
        <div className="bg-white shadow rounded-lg p-10">
          <h1 className="text-2xl ">Appointment Count:</h1>
          {!loading && (
            <p className="text-2xl font-bold text-blue-700">
              {appointment.length}
            </p>
          )}
        </div>
      </div>

      <div className="flex  gap-4 px-6 py-4 mb-2 ">
        <h2 className="text-2xl  font-semibold uppercase text-blue-600">
          Clinic Appointments
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Patient Name</th>
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Slot Time</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Payment</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {appointment.map((ap, index) => (
              <tr key={ap.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium">{index + 1}</td>

                <td className="px-6 py-4"> {ap.patientName}</td>

                <td className="px-6 py-4">Dr. {ap.doctor.name}</td>

                <td className="px-6 py-4">{ap.slotTime}</td>

                <td className="px-6 py-4">{ap.date}</td>

                <td className="px-6 py-4">
                  <select
                    value={ap.status}
                    className={`px-2 py-1 border rounded-md text-sm ${getStatusColor(
                      ap.status,
                    )}`}
                    onChange={(e) => updateStatus(ap.id, e.target.value)}
                  >
                    <option value={AppointmentStatus.PENDING}>PENDING</option>
                    <option value={AppointmentStatus.CONFIRMED}>
                      CONFIRMED
                    </option>
                    <option value={AppointmentStatus.REJECTED}>
                      CANCELLED
                    </option>
                  </select>
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium">
                    {ap.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
