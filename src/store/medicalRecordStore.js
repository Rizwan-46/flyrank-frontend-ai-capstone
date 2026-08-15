import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { medicalRecords as initialMedicalRecords } from "@/data/medicalRecords";

export const useMedicalRecordStore = create(
  persist(
    (set) => ({
      medicalRecords: initialMedicalRecords,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addMedicalRecord: (petId, recordData) => {
        const newRecord = {
          id: `record-${Date.now()}`,
          petId,
          ...recordData,
        };
        set((state) => ({
          medicalRecords: [...state.medicalRecords, newRecord],
        }));
        return newRecord;
      },

      updateMedicalRecord: (recordId, updates) => {
        set((state) => ({
          medicalRecords: state.medicalRecords.map((r) =>
            r.id === recordId ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteMedicalRecord: (recordId) => {
        set((state) => ({
          medicalRecords: state.medicalRecords.filter((r) => r.id !== recordId),
        }));
      },

      removeByPetId: (petId) => {
        set((state) => ({
          medicalRecords: state.medicalRecords.filter((r) => r.petId !== petId),
        }));
      },
    }),
    {
      name: "pet-care-medical-records-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);