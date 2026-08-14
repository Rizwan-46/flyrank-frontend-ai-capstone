import { create } from "zustand";
import { medicalRecords as initialMedicalRecords } from "@/data/medicalRecords";

export const useMedicalRecordStore = create(() => ({
  medicalRecords: initialMedicalRecords,
}));