import {
  Gender,
  PaymentMethod,
  AppointmentStatus,
  PaymentStatus,
} from "@/prisma/generated/prisma/enums";
export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface Slot {
  doctorId: number;
  speciality: string;
  startTime: number;
  endTime: number;
}

export interface BookingSearchParams {
  doctorId?: string;
  slot?: string;
  date?: string;
}

export type Props = {
  doctorId: number;
  slot: string;
  appDate: string;
  doctorName: string;
  speciality: string;
  fees: number;
  username?: string;
  userId?: number;
};

export type Appointment = {
  doctorId: number;
  patientId: number;
  patientName: string;
  doctorName: string;
  slotTime: string;
  paymentMethod: string;
  date: string;
  status: string;
  paymentStatus: string;
  doctor: {
    name: string;
  };
};

export type SubHeroProps = {
  title: string;
  subheading: string;
};

export type ClinicAppointment = {
  id: number;
  doctorId: number;
  patientName: string;
  gender: Gender;
  paymentMethod: PaymentMethod;
  slotTime: string;
  date: string;
  status: AppointmentStatus;
  createdAt: string;
  paymentStatus: PaymentStatus;
  doctor: {
    name: string;
  };
};

export type Doctor = {
  name: string;
  email: string;
  phonenumber: string | null;
  doctorDetails: {
    doctorId: number;
    speciality: string;
    degree: string[];
    startTime: number;
    endTime: number;
    isAvailable: boolean;
  };
};
