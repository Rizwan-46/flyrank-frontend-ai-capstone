"use client";

import { useMemo, useState } from "react";
import { PawPrint, Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";
import { useVaccinationStore } from "@/store/vaccinationStore";
import { useMedicalRecordStore } from "@/store/medicalRecordStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Button } from "@/components/ui/button";
import PetCard from "@/components/pets/PetCard";
import PetSearchBar from "@/components/pets/PetSearchBar";
import PetFormDialog from "@/components/pets/PetFormDialog";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import EmptyState from "@/components/dashboard/EmptyState";

export default function PetsPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const pets = usePetStore((state) => state.pets);
  const addPet = usePetStore((state) => state.addPet);
  const updatePet = usePetStore((state) => state.updatePet);
  const deletePet = usePetStore((state) => state.deletePet);

  const vaccinations = useVaccinationStore((state) => state.vaccinations);
  const medicalRecords = useMedicalRecordStore((state) => state.medicalRecords);
  const appointments = useAppointmentStore((state) => state.appointments);
  const removeVaccinationsByPetId = useVaccinationStore((state) => state.removeByPetId);
  const removeMedicalRecordsByPetId = useMedicalRecordStore((state) => state.removeByPetId);
  const removeAppointmentsByPetId = useAppointmentStore((state) => state.removeByPetId);

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [deletingPet, setDeletingPet] = useState(null);

  const ownPets = useMemo(
    () => pets.filter((pet) => pet.userId === currentUser?.id),
    [pets, currentUser?.id]
  );

  const filteredPets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return ownPets;
    return ownPets.filter((pet) => pet.name.toLowerCase().includes(query));
  }, [ownPets, search]);

  function handleAddClick() {
    setEditingPet(null);
    setFormOpen(true);
  }

  function handleEditClick(pet) {
    setEditingPet(pet);
    setFormOpen(true);
  }

  function handleFormSubmit(data) {
    if (editingPet) {
      updatePet(editingPet.id, data);
    } else {
      addPet({ ...data, userId: currentUser.id });
    }
  }

  function handleDeleteClick(pet) {
    setDeletingPet(pet);
  }

  function handleConfirmDelete() {
    if (!deletingPet) return;
    const petId = deletingPet.id;
    deletePet(petId);
    removeVaccinationsByPetId(petId);
    removeMedicalRecordsByPetId(petId);
    removeAppointmentsByPetId(petId);
    setDeletingPet(null);
  }

  const relatedCounts = deletingPet
    ? {
        vaccinations: vaccinations.filter((v) => v.petId === deletingPet.id).length,
        medicalRecords: medicalRecords.filter((r) => r.petId === deletingPet.id).length,
        appointments: appointments.filter((a) => a.petId === deletingPet.id).length,
      }
    : { vaccinations: 0, medicalRecords: 0, appointments: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Pets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your pets&apos; profiles and information.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Pet
        </Button>
      </div>

      {ownPets.length > 0 && <PetSearchBar value={search} onChange={setSearch} />}

      {ownPets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Add your first pet to start tracking their health and care."
        />
      ) : filteredPets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets found"
          description={`No pets match "${search}". Try a different search.`}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <PetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        pet={editingPet}
        onSubmit={handleFormSubmit}
      />

      <DeletePetDialog
        open={!!deletingPet}
        onOpenChange={(open) => !open && setDeletingPet(null)}
        pet={deletingPet}
        relatedCounts={relatedCounts}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}