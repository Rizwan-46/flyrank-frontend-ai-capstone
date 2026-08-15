"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";
import { useMedicalRecordStore } from "@/store/medicalRecordStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import MedicalTimeline from "./MedicalTimeline";
import MedicalRecordFormDialog from "./MedicalRecordFormDialog";
import DeleteMedicalRecordDialog from "./DeleteMedicalRecordDialog";
import MedicalRecordSearchBar from "./MedicalRecordSearchBar";
import { parseDateOnly } from "@/utils/dateUtils";

const ALL_PETS_VALUE = "all";
const ALL_VETS_VALUE = "all_vets";

export default function MedicalHistorySection({ petId = null, highlightId = null }) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const allPets = usePetStore((state) => state.pets);
  const allRecords = useMedicalRecordStore((state) => state.medicalRecords);
  const addMedicalRecord = useMedicalRecordStore((state) => state.addMedicalRecord);
  const updateMedicalRecord = useMedicalRecordStore((state) => state.updateMedicalRecord);
  const deleteMedicalRecord = useMedicalRecordStore((state) => state.deleteMedicalRecord);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [formPetId, setFormPetId] = useState(petId);
  const [search, setSearch] = useState("");
  const [petFilter, setPetFilter] = useState(ALL_PETS_VALUE);
  const [vetFilter, setVetFilter] = useState(ALL_VETS_VALUE);

  const ownPets = useMemo(
    () => allPets.filter((pet) => pet.userId === currentUser?.id),
    [allPets, currentUser?.id]
  );

  const petsById = useMemo(
    () => Object.fromEntries(ownPets.map((pet) => [pet.id, pet])),
    [ownPets]
  );

  const ownPetIds = useMemo(() => ownPets.map((p) => p.id), [ownPets]);

  const scopedRecords = useMemo(() => {
    const scoped = petId
      ? allRecords.filter((r) => r.petId === petId)
      : allRecords.filter((r) => ownPetIds.includes(r.petId));

    return scoped.sort((a, b) => {
      const dateDiff = parseDateOnly(b.date) - parseDateOnly(a.date);
      if (dateDiff !== 0) return dateDiff;
      return a.id.localeCompare(b.id);
    });
  }, [allRecords, petId, ownPetIds]);

  // Extract unique veterinarians for the filter dropdown
  const uniqueVets = useMemo(() => {
    const vets = new Set(scopedRecords.map((r) => r.veterinarian).filter(Boolean));
    return Array.from(vets).sort();
  }, [scopedRecords]);

  const records = useMemo(() => {
    if (petId) return scopedRecords;

    let filtered = scopedRecords;

    if (petFilter !== ALL_PETS_VALUE) {
      filtered = filtered.filter((r) => r.petId === petFilter);
    }

    if (vetFilter !== ALL_VETS_VALUE) {
      filtered = filtered.filter((r) => r.veterinarian === vetFilter);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((r) => {
        const petName = petsById[r.petId]?.name ?? "";
        return (
          r.reason.toLowerCase().includes(query) ||
          r.diagnosis.toLowerCase().includes(query) ||
          r.veterinarian.toLowerCase().includes(query) ||
          petName.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [scopedRecords, petId, petFilter, vetFilter, search, petsById]);

  // Deep-link support: scroll to and briefly highlight the record
  // referenced by ?highlight= from a Dashboard click.
  useEffect(() => {
    if (!highlightId) return;
    const el = document.getElementById(`medical-record-${highlightId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId, records]);

  function handleAddClick() {
    setEditingRecord(null);
    setFormPetId(petId);
    setFormOpen(true);
  }

  function handleEditClick(record) {
    setEditingRecord(record);
    setFormPetId(record.petId);
    setFormOpen(true);
  }

  function handleFormSubmit(data) {
    if (editingRecord) {
      updateMedicalRecord(editingRecord.id, data);
    } else {
      addMedicalRecord(formPetId, data);
    }
  }

  function handleDeleteClick(record) {
    setDeletingRecord(record);
  }

  function handleConfirmDelete() {
    if (!deletingRecord) return;
    deleteMedicalRecord(deletingRecord.id);
    setDeletingRecord(null);
  }

  const hasActiveFilters = search.trim() !== "" || petFilter !== ALL_PETS_VALUE || vetFilter !== ALL_VETS_VALUE;

  return (
    <section className="space-y-6" data-testid="medical-history-section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {petId ? "Medical History" : "Medical Records"}
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {records.length} record{records.length === 1 ? "" : "s"}
            {hasActiveFilters ? " found" : " on file"}
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleAddClick}
          disabled={!petId && ownPets.length === 0}
          className="w-full sm:w-auto"
          data-testid="add-record-btn"
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Add Record
        </Button>
      </div>

      {!petId && scopedRecords.length > 0 && (
        <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center" data-testid="medical-filters">
          <div className="flex-1 min-w-[200px]">
            <MedicalRecordSearchBar value={search} onChange={setSearch} />
          </div>
          
          <Select value={petFilter} onValueChange={setPetFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card shadow-sm" aria-label="Filter by pet" data-testid="pet-filter">
              <SelectValue placeholder="Filter by pet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PETS_VALUE}>All pets</SelectItem>
              {ownPets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {uniqueVets.length > 0 && (
            <Select value={vetFilter} onValueChange={setVetFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-card shadow-sm" aria-label="Filter by veterinarian" data-testid="vet-filter">
                <SelectValue placeholder="Filter by vet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VETS_VALUE}>All veterinarians</SelectItem>
                {uniqueVets.map((vet) => (
                  <SelectItem key={vet} value={vet}>
                    {vet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="pt-2">
        <MedicalTimeline
          records={records}
          petsById={petsById}
          showPetName={!petId}
          highlightId={highlightId}
          emptyTitle={hasActiveFilters ? "No records found" : undefined}
          emptyDescription={
            hasActiveFilters
              ? "Try a different search term or filter combination."
              : undefined
          }
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      <MedicalRecordFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        record={editingRecord}
        pets={ownPets}
        lockedPetId={petId}
        selectedPetId={formPetId}
        onPetChange={setFormPetId}
        onSubmit={handleFormSubmit}
      />

      <DeleteMedicalRecordDialog
        open={!!deletingRecord}
        onOpenChange={(open) => !open && setDeletingRecord(null)}
        record={deletingRecord}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}