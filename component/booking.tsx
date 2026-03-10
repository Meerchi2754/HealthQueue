"use client";

import { useState } from "react";
import { Props } from "@/types";
import { useRazorpay } from "@/component/useRazorpay";
import { Gender, PaymentMethod } from "@/app/generated/prisma/enums";
import SubHeroSection from "@/component/subHeroSection";

export default function BookingComponent({
  doctorId,
  slot,
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
  const [date, setDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const { initiatePayment } = useRazorpay();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === PaymentMethod.cash) {
      +alert(
        "Cash booking is not available yet. Please choose Online payment.",
      );
      return;
    }

    initiatePayment({
      doctorId,
      slotTime: slot!,
      date,
      patientId: userId!,
      gender,
      paymentMethod,
      onSuccess: () => alert("Payment Successful"),
      onFailure: () => alert("Payment Failed"),
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
                defaultValue={username}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
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
            <button className="bg-blue-700 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition cursor-pointer">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
