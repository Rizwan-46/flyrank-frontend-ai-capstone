import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { vaccinations as initialVaccinations } from "@/data/vaccinations";

export const useVaccinationStore = create(
  persist(
    (set) => ({
      vaccinations: initialVaccinations,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      // Cascade-only action for this phase. Full vaccination
      // CRUD will be implemented in its own dedicated phase.
      removeByPetId: (petId) => {
        set((state) => ({
          vaccinations: state.vaccinations.filter((v) => v.petId !== petId),
        }));
      },
    }),
    {
      name: "pet-care-vaccinations-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);