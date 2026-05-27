"use client";

import { useState } from "react";
import { Props } from "@/types";
import { useRazorpay } from "@/component/useRazorpay";
import { Gender, PaymentMethod } from "@/prisma/generated/prisma/enums";
import SubHeroSection from "@/component/subHeroSection";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Span } from "next/dist/trace";

export default function BookingComponent({
  doctorId,
  slot,
  appDate,
  doctorName,
  speciality,
  fees,
  username,
  userId,
}: Props) {
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.online,
  );
  const [patientName, setPatientName] = useState<string>("");
  const [date, setDate] = useState<string>(appDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { initiatePayment } = useRazorpay();
  const router = useRouter();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    // Validate patient name
    if (patientName.length < 4 || patientName.length > 12) {
      setError(true);
      setLoading(false);
      const message = "Minimum length must be 4\nMaximum length must be 12.";
      setErrorMessage(message);
      return;
    }

    // Handle Cash Payment
    if (paymentMethod === PaymentMethod.cash) {
      try {
        const response = await fetch("/api/createCashAppointment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientName,
            doctorId,
            slotTime: slot,
            date,
            gender,
            paymentMethod,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create appointment");
        }

        setLoading(false);
        toast.success(
          "Appointment booked! Pay at clinic. Awaiting confirmation."
        );
        router.push("/history");
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message || "Failed to book appointment");
        console.error("Cash appointment error:", error);
      }
      return;
    }

    // Handle Online Payment
    initiatePayment({
      doctorId,
      slotTime: slot!,
      date,
      patientId: userId!,
      patientName,
      gender,
      fees,
      currency: "INR",
      paymentMethod,
      onSuccess: () => {
        setLoading(false);
        toast.success("Payment Successful.");
        router.push("/history");
      },
      onFailure: () => {
        setLoading(false);
        toast.error("Payment Failed.");
        router.push("/user");
      },
    });
  };

  return (
    <>
      <SubHeroSection
        title="CHECK YOUR DETAILS AND PAY"
        subheading="Check your Details  and confirm your Appointment."
      />
      <div className="pt-15 pb-3  flex justify-center flex-wrap items-center ">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-blue-700">
              Dr. {doctorName}
            </h2>

            <p className="text-gray-500">{speciality}</p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Appointment Slot</p>
              <p className="text-lg font-semibold">{date}</p>
              <p className="text-lg font-semibold">{slot}</p>
            </div>

            <div className="flex justify-between border-t pt-4">
              <span className="text-gray-600">Consultation Fee</span>
              <span className="text-xl font-semibold">₹{fees}</span>
            </div>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleBooking}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-5"
          >
            <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Name</label>
              <input
                type="text"
                onChange={(e) => setPatientName(e.target.value)}
                defaultValue={username}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {error ? (
                <p className="text-sm text-red-600">{errorMessage}</p>
              ) : (
                <></>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="border rounded-md px-3 py-2"
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
                <option value={Gender.preferNotToSay}>Prefer Not to Say</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className="border rounded-md px-3 py-2"
              >
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              disabled={loading}
              className="bg-blue-700 text-white py-3 rounded-md font-semibold transition cursor-pointer
          disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {paymentMethod === PaymentMethod.cash
                    ? "Booking Appointment..."
                    : "Processing Payment..."}
                </span>
              ) : paymentMethod === PaymentMethod.cash ? (
                "Book Appointment (Pay at Clinic)"
              ) : (
                "Confirm Payment"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
