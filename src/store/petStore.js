import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { pets as initialPets } from "@/data/pets";

export const usePetStore = create(
  persist(
    (set) => ({
      pets: initialPets,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addPet: (petData) => {
        const newPet = { id: `pet-${Date.now()}`, ...petData };
        set((state) => ({ pets: [...state.pets, newPet] }));
        return newPet;
      },

      updatePet: (petId, updates) => {
        set((state) => ({
          pets: state.pets.map((p) =>
            p.id === petId ? { ...p, ...updates } : p
          ),
        }));
      },

      deletePet: (petId) => {
        set((state) => ({
          pets: state.pets.filter((p) => p.id !== petId),
        }));
      },
    }),
    {
      name: "pet-care-pets-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);