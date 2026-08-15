import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { medicalRecords as initialMedicalRecords } from "@/data/medicalRecords";

export const useMedicalRecordStore = create(
  persist(
    (set) => ({
      medicalRecords: initialMedicalRecords,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

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