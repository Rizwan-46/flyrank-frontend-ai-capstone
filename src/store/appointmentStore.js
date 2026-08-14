import { create } from "zustand";
import { appointments as initialAppointments } from "@/data/appointments";

export const useAppointmentStore = create(() => ({
  appointments: initialAppointments,
}));