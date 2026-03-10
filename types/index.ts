export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}
export interface Doctor {
  id: number;
  name: string;
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
}

export type Props = {
  doctorId: number;
  slot: string;
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
};

export type SubHeroProps = {
  title: string;
  subheading: string;
};
