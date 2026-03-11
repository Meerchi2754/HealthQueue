"use client";
import { useEffect, useState } from "react";
import { Doctor } from "@/types";
import Loading from "@/component/loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DoctorList() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const [isAvailable, setIsAvailable] = useState<boolean>();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const getAlldoctor = async () => {
      try {
        const response = await fetch("/api/getAllDoctor");
        const data = await response.json();
        setDoctors(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getAlldoctor();
  }, []);

  const handleUpdate = async (
    e: React.FormEvent,
    doctorId: number,
    doctor: Doctor,
  ) => {
    e.preventDefault();

    setUpdatingId(doctorId);

    try {
      const res = await fetch("/api/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId,
          isAvailable: isAvailable ?? doctor.doctorDetails.isAvailable,
          startTime: startTime ?? doctor.doctorDetails.startTime,
          endTime: endTime ?? doctor.doctorDetails.endTime,
        }),
      });

      const data = await res.json();
      console.log(data);
      toast.success("DOCTOR UPDATED");
      router.push("/home"); // better than push
    } catch (error) {
      console.log(error);
      toast.success(`DOCTOR NOT UPDATED. ${error}`);
    } finally {
      setUpdatingId(null);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Doctor Management</h1>
        <p className="text-slate-500">
          Edit doctor availability and time slots
        </p>
      </div>

      {loading && <Loading />}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-3 ">
                <div className="w-14 h-15 flex rounded-full">
                  <p className="bg-blue-900  text-blue-700 font-bold  text-lg">
                    {d.name?.charAt(0)}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-lg text-slate-800">
                    Dr. {d.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {d.doctorDetails?.speciality}
                  </p>
                </div>
              </div>

              {/* CONTACT */}
              <div className="text-sm text-slate-600 space-y-1 mb-4">
                <p>
                  <strong>Email:</strong> {d.email}
                </p>

                <p>
                  <strong>Phone:</strong> {d.phonenumber ?? "Not Provided"}
                </p>

                <p>
                  <strong>Degree:</strong> {d.doctorDetails?.degree?.join(", ")}
                </p>
              </div>

              {/* TIME SLOT */}
              <form
                onSubmit={(e) => handleUpdate(e, d.doctorDetails.doctorId, d)}
              >
                <div className="mb-4">
                  <p className="font-semibold text-slate-700 mb-1">
                    Consultation Hours
                  </p>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      max={23}
                      defaultValue={d.doctorDetails?.startTime}
                      className="border rounded-md px-3 py-2 w-20 text-center"
                      onChange={(e) => setStartTime(Number(e.target.value))}
                    />

                    <span className="text-slate-500">to</span>

                    <input
                      type="number"
                      min={1}
                      max={24}
                      defaultValue={d.doctorDetails?.endTime}
                      className="border rounded-md px-3 py-2 w-20 text-center"
                      onChange={(e) => setEndTime(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* STATUS */}
                <div className="flex justify-start gap-3">
                  <span className="font-semibold text-slate-700">
                    Availability
                  </span>

                  <input
                    type="checkbox"
                    defaultChecked={d.doctorDetails?.isAvailable}
                    className="h-3 w-3"
                    onChange={(e) => setIsAvailable(Boolean(e.target.checked))}
                  />
                </div>
                {/* UPDATE BUTTON */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                  disabled={updatingId === d.doctorDetails.doctorId}
                >
                  {updatingId === d.doctorDetails.doctorId ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Updating...
                    </span>
                  ) : (
                    "Update Doctor"
                  )}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
