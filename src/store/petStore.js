import { create } from "zustand";
import { pets as initialPets } from "@/data/pets";

export const usePetStore = create(() => ({
  pets: initialPets,
}));