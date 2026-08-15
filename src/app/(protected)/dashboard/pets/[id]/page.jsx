"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { usePetStore } from "@/store/petStore";
import { useVaccinationStore } from "@/store/vaccinationStore";
import { useMedicalRecordStore } from "@/store/medicalRecordStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PetFormDialog from "@/components/pets/PetFormDialog";
import DeletePetDialog from "@/components/pets/DeletePetDialog";
import MedicalHistorySection from "@/components/medical/MedicalHistorySection";
import VaccinationsSection from "@/components/vaccinations/VaccinationsSection";
import AppointmentsSection from "@/components/appointments/AppointmentsSection";
import { formatDate } from "@/utils/dateUtils";

export default function PetProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const pets = usePetStore((state) => state.pets);
  const updatePet = usePetStore((state) => state.updatePet);
  const deletePet = usePetStore((state) => state.deletePet);

  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "overview";
  const highlightId = searchParams.get("highlight");
  const [activeTab, setActiveTab] = useState(initialTab);


  const vaccinations = useVaccinationStore((state) => state.vaccinations);
  const medicalRecords = useMedicalRecordStore((state) => state.medicalRecords);
  const appointments = useAppointmentStore((state) => state.appointments);
  const removeVaccinationsByPetId = useVaccinationStore((state) => state.removeByPetId);
  const removeMedicalRecordsByPetId = useMedicalRecordStore((state) => state.removeByPetId);
  const removeAppointmentsByPetId = useAppointmentStore((state) => state.removeByPetId);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const pet = useMemo(() => pets.find((p) => p.id === id), [pets, id]);

  const relatedCounts = pet
    ? {
      vaccinations: vaccinations.filter((v) => v.petId === pet.id).length,
      medicalRecords: medicalRecords.filter((r) => r.petId === pet.id).length,
      appointments: appointments.filter((a) => a.petId === pet.id).length,
    }
    : { vaccinations: 0, medicalRecords: 0, appointments: 0 };

  if (!pet) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/pets"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pets
        </Link>
        <div className="rounded-2xl border border-dashed border-border py-10 text-center">
          <p className="text-sm font-medium text-foreground">Pet not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This pet may have been deleted or doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  function handleConfirmDelete() {
    deletePet(pet.id);
    removeVaccinationsByPetId(pet.id);
    removeMedicalRecordsByPetId(pet.id);
    removeAppointmentsByPetId(pet.id);
    router.push("/dashboard/pets");
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/pets"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pets
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{pet.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pet.breed} · {pet.species} · {pet.gender}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>


      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <InfoRow label="Date of Birth" value={formatDate(pet.dateOfBirth)} />
              <InfoRow label="Weight" value={`${pet.weight} kg`} />
              <InfoRow label="Microchip ID" value={pet.microchipId || "Not recorded"} />
              <InfoRow
                label="Allergies"
                value={
                  pet.allergies && pet.allergies.length > 0
                    ? pet.allergies.join(", ")
                    : "None recorded"
                }
              />
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted-foreground">Notes</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {pet.notes || "No notes."}
                </dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="mt-4">
          <MedicalHistorySection petId={pet.id} highlightId={highlightId} />
        </TabsContent>


        <TabsContent value="vaccinations" className="mt-4">
          <VaccinationsSection petId={pet.id} highlightId={highlightId} />
        </TabsContent>
        <TabsContent value="appointments" className="mt-4">
          <AppointmentsSection petId={pet.id} />
        </TabsContent>
      </Tabs>

      <PetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        pet={pet}
        onSubmit={(data) => updatePet(pet.id, data)}
      />

      <DeletePetDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        pet={pet}
        relatedCounts={relatedCounts}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function PlaceholderPanel({ title, count, note }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-6 text-center">
      <p className="text-sm font-medium text-foreground">
        {count} {title} record{count === 1 ? "" : "s"} on file
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}