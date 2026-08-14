import { create } from "zustand";
import { vaccinations as initialVaccinations } from "@/data/vaccinations";

export const useVaccinationStore = create(() => ({
  vaccinations: initialVaccinations,
}));