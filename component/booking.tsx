"use client";

import { useState } from "react";
import { Props } from "@/types";
import { useRazorpay } from "@/component/useRazorpay";
import { cashAppointment } from "./cashAppointment";
import { Gender, PaymentMethod } from "@/app/generated/prisma/enums";

export default function BookingComponent({
  doctorId,
  slot,
  doctorName,
  speciality,
  fees,
  username,
  userId,
}: Props) {
  const [gender, setGender] = useState<Gender>("MALE");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const { initiatePayment } = useRazorpay();
  const date = "2026-19-10";
  const handleBooking = (e: React.FormEvent) => {
    if (paymentMethod === "cash") {
      // e.preventDefault();
      alert("Booked! Using CASH!");
    } else {
      e.preventDefault();
      initiatePayment({
        doctorId: doctorId,
        slotTime: slot!,
        date: "2025-04-01",
        patientId: userId!,
        gender,
        paymentMethod,
        onSuccess: () => alert("Payment Successfull."),
        onFailure: () => alert("Payment Failed. Please try Again."),
      });
    }
  };

  return (
    <form className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-bold">Booking Page</h1>

      <p>Doctor ID: {doctorId}</p>
      <p>Doctor Name: {doctorName}</p>
      <p>Doctor Speciality: {speciality}</p>
      <p>Slot: {slot}</p>

      <input type="hidden" name="doctorId" value={doctorId} />
      <input type="hidden" name="slot" value={slot} />

      <div className="flex gap-3">
        <label>Name</label>
        <input
          name="name"
          type="text"
          defaultValue={username}
          className="bg-white text-black px-2"
        />
      </div>

      <div className="flex gap-3">
        <label>Gender</label>
        <select
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          className="bg-white text-black"
        >
          <option value="">Select your Gender</option>
          <option value={Gender.MALE}>Male</option>
          <option value={Gender.FEMALE}>Female</option>
          <option value={Gender.OTHER}>Other</option>
          <option value={Gender.preferNotToSay}>Prefer Not to Say</option>
        </select>
      </div>

      <div className="flex gap-3">
        <label>Payment</label>
        <select
          name="payment"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          className="bg-white text-black"
        >
          <option value="">Select Payment Method</option>
          <option value={PaymentMethod.online}>Online</option>
          <option value={PaymentMethod.cash}>Cash</option>
          <option value={PaymentMethod.other}>Other</option>
        </select>
      </div>

      <p className="font-semibold">Fees: ₹{fees}</p>
      <div>
        <button
          type="submit"
          onClick={handleBooking}
          className="bg-blue-800 text-white px-4 py-2 rounded  hover:bg-blue-500"
        >
          Book Appointment
        </button>
      </div>
    </form>
  );
}
