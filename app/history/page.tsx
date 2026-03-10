"use client";
import { Navbar } from "@/component/navbar";
import { Appointment } from "@/types";
import { useEffect, useState } from "react";

export default function History() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();
        setAppointments(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []);

  const statusStyle = (status: string) => {
    if (status === "APPROVED")
      return "bg-green-100 text-green-700";
    if (status === "PENDING")
      return "bg-yellow-100 text-yellow-700";
    if (status === "REJECTED")
      return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  const paymentStyle = (status: string) => {
    if (status === "PAID")
      return "bg-green-100 text-green-700";
    if (status === "UNPAID")
      return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Appointment History
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              All your past and upcoming appointments
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            </div>
          )}

          {/* Empty */}
          {!loading && appointments.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No Appointments Found
            </div>
          )}

          {/* Table */}
          {!loading && appointments.length > 0 && (
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <table className="w-full text-sm">

                <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Slot Time</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Payment</th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {appointments.map((ap, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition">

                      <td className="px-6 py-4 font-medium">{index + 1}</td>

                      <td className="px-6 py-4">{ap.patientName}</td>

                      <td className="px-6 py-4">
                        Dr. {ap.doctorId}
                      </td>

                      <td className="px-6 py-4">{ap.slotTime}</td>

                      <td className="px-6 py-4">{ap.date}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                            ap.status
                          )}`}
                        >
                          {ap.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStyle(
                            ap.paymentStatus
                          )}`}
                        >
                          {ap.paymentStatus}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </>
  );
}