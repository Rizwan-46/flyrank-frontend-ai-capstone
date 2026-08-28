import { z } from "zod";
import { tool } from "ai";
import { getVaccinationStatus } from "@/utils/vaccinationStatus";
import { VACCINATION_STATUS } from "@/utils/statusColors";
import { parseDateOnly, getTodayDateOnly } from "@/utils/dateUtils";

/**
 * Builds the getPetHealthSummary tool scoped to a single request's data
 * snapshot.
 *
 * This project has no real backend — pet, vaccination, medical record, and
 * appointment data lives in the browser (Zustand + localStorage). A server
 * route cannot import that state directly. Instead, the client includes a
 * scoped, read-only snapshot of the current user's data in the chat request
 * body, and this factory builds the tool fresh for that one request, closing
 * over that snapshot. Nothing here is persisted, cached, or shared across
 * requests or users.
 *
 * DEV TESTING: passing petId "TEST_ERROR" deliberately throws, to exercise
 * the output-error UI state without needing a real failure. This is a
 * documented, inert value — it does nothing outside triggering this path.
 */
export function createPetTools(dataSnapshot) {
  const {
    pets = [],
    vaccinations = [],
    medicalRecords = [],
    appointments = [],
  } = dataSnapshot || {};

  const getPetHealthSummary = tool({
    description:
      "Get a structured health summary for one of the user's pets: vaccination status counts (completed/overdue/upcoming), the next scheduled appointment, and the most recent medical records. Use this whenever the user asks about a specific pet's health, vaccinations, overdue shots, or medical history by name.",
    inputSchema: z.object({
      petId: z
        .string()
        .describe(
          "The id of the pet to look up, matched against the pet directory provided in context."
        ),
    }),
    execute: async ({ petId }) => {
      // Dev-only intentional failure path — see file header.
      if (petId === "TEST_ERROR") {
        throw new Error("Simulated failure for testing the tool error state.");
      }

      const pet = pets.find((p) => p.id === petId);

      if (!pet) {
        return {
          notFound: true,
          message:
            "No pet was found with that id. It may have been removed, or the id doesn't match any of this user's pets.",
        };
      }

      const petVaccinations = vaccinations.filter((v) => v.petId === petId);
      const completed = petVaccinations.filter(
        (v) => getVaccinationStatus(v) === VACCINATION_STATUS.COMPLETED
      ).length;
      const overdue = petVaccinations.filter(
        (v) => getVaccinationStatus(v) === VACCINATION_STATUS.OVERDUE
      ).length;
      const upcoming = petVaccinations.filter((v) => {
        const status = getVaccinationStatus(v);
        return (
          status === VACCINATION_STATUS.UPCOMING ||
          status === VACCINATION_STATUS.DUE_TODAY
        );
      }).length;

      const today = getTodayDateOnly();
      const nextAppointment = appointments
        .filter(
          (a) =>
            a.petId === petId &&
            a.status === "scheduled" &&
            parseDateOnly(a.date) >= today
        )
        .sort((a, b) => parseDateOnly(a.date) - parseDateOnly(b.date))[0];

      const recentMedicalRecords = medicalRecords
        .filter((r) => r.petId === petId)
        .sort((a, b) => parseDateOnly(b.date) - parseDateOnly(a.date))
        .slice(0, 3)
        .map((r) => ({
          date: r.date,
          diagnosis: r.diagnosis,
          notes: r.notes || "",
        }));

      return {
        pet: {
          id: pet.id,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
        },
        healthStatus: overdue > 0 ? "needs-attention" : "good",
        vaccinations: { completed, overdue, upcoming },
        upcomingAppointment: nextAppointment
          ? { date: nextAppointment.date, reason: nextAppointment.reason }
          : null,
        recentMedicalRecords,
      };
    },
  });

  return { getPetHealthSummary };
}