/**
 * Builds the read-only data snapshot sent to /api/chat alongside the
 * conversation. Scoped strictly to the current user's own pets — never
 * the full store contents — since this crosses into a network request.
 */
export function buildPetContext({
  currentUser,
  pets,
  vaccinations,
  medicalRecords,
  appointments,
}) {
  if (!currentUser) {
    return { pets: [], vaccinations: [], medicalRecords: [], appointments: [] };
  }

  const ownPets = pets.filter((p) => p.userId === currentUser.id);
  const ownPetIds = ownPets.map((p) => p.id);

  return {
    pets: ownPets.map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species,
      breed: p.breed,
    })),
    vaccinations: vaccinations.filter((v) => ownPetIds.includes(v.petId)),
    medicalRecords: medicalRecords.filter((r) => ownPetIds.includes(r.petId)),
    appointments: appointments.filter((a) => ownPetIds.includes(a.petId)),
  };
}