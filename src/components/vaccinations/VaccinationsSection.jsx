"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Syringe } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";
import { useVaccinationStore } from "@/store/vaccinationStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import EmptyState from "@/components/dashboard/EmptyState";
import VaccinationListItem from "./VaccinationListItem";
import VaccinationSearchBar from "./VaccinationSearchBar";
import VaccinationFormDialog from "./VaccinationFormDialog";
import CompleteVaccinationDialog from "./CompleteVaccinationDialog";
import DeleteVaccinationDialog from "./DeleteVaccinationDialog";
import { parseDateOnly } from "@/utils/dateUtils";
import { getVaccinationStatus } from "@/utils/vaccinationStatus";
import { VACCINATION_STATUS } from "@/utils/statusColors";

const ALL_PETS_VALUE = "all";
const ALL_VETS_VALUE = "all_vets";

export default function VaccinationsSection({ petId = null, highlightId = null }) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const allPets = usePetStore((state) => state.pets);
  const allVaccinations = useVaccinationStore((state) => state.vaccinations);
  const addVaccination = useVaccinationStore((state) => state.addVaccination);
  const updateVaccination = useVaccinationStore((state) => state.updateVaccination);
  const deleteVaccination = useVaccinationStore((state) => state.deleteVaccination);
  const completeVaccination = useVaccinationStore((state) => state.completeVaccination);

  const [formOpen, setFormOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [completingVaccination, setCompletingVaccination] = useState(null);
  const [deletingVaccination, setDeletingVaccination] = useState(null);
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

  const scopedVaccinations = useMemo(() => {
    return petId
      ? allVaccinations.filter((v) => v.petId === petId)
      : allVaccinations.filter((v) => ownPetIds.includes(v.petId));
  }, [allVaccinations, petId, ownPetIds]);

  // Extract unique veterinarians for the filter dropdown
  const uniqueVets = useMemo(() => {
    const vets = new Set(scopedVaccinations.map((v) => v.veterinarian).filter(Boolean));
    return Array.from(vets).sort();
  }, [scopedVaccinations]);

  // Search + pet filter + vet filter only apply on the all-pets view.
  const filteredVaccinations = useMemo(() => {
    if (petId) return scopedVaccinations;

    let filtered = scopedVaccinations;

    if (petFilter !== ALL_PETS_VALUE) {
      filtered = filtered.filter((v) => v.petId === petFilter);
    }
    
    if (vetFilter !== ALL_VETS_VALUE) {
      filtered = filtered.filter((v) => v.veterinarian === vetFilter);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((v) => {
        const petName = petsById[v.petId]?.name ?? "";
        return (
          v.name.toLowerCase().includes(query) ||
          v.veterinarian.toLowerCase().includes(query) ||
          petName.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [scopedVaccinations, petId, petFilter, vetFilter, search, petsById]);

  const activeVaccinations = useMemo(() => {
    return filteredVaccinations
      .filter((v) => getVaccinationStatus(v) !== VACCINATION_STATUS.COMPLETED)
      .sort((a, b) => parseDateOnly(a.nextDueDate) - parseDateOnly(b.nextDueDate));
  }, [filteredVaccinations]);

  const historyVaccinations = useMemo(() => {
    return filteredVaccinations
      .filter((v) => getVaccinationStatus(v) === VACCINATION_STATUS.COMPLETED)
      .sort(
        (a, b) => parseDateOnly(b.administeredDate) - parseDateOnly(a.administeredDate)
      );
  }, [filteredVaccinations]);

  // Deep-link support: scroll to and briefly highlight the vaccination[cite: 22]
  // referenced by ?highlight= from a Dashboard reminder click.[cite: 22]
  useEffect(() => {
    if (!highlightId) return;
    const el = document.getElementById(`vaccination-${highlightId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId, activeVaccinations, historyVaccinations]);

  function handleAddClick() {
    setEditingVaccination(null);
    setFormOpen(true);
  }

  function handleEditClick(vaccination) {
    setEditingVaccination(vaccination);
    setFormOpen(true);
  }

  function handleFormSubmit(data) {
    if (editingVaccination) {
      updateVaccination(editingVaccination.id, data);
    } else {
      addVaccination(petId, data);
    }
  }

  function handleCompleteClick(vaccination) {
    setCompletingVaccination(vaccination);
  }

  function handleConfirmComplete(data) {
    if (!completingVaccination) return;
    completeVaccination(completingVaccination.id, data);
    setCompletingVaccination(null);
  }

  function handleDeleteClick(vaccination) {
    setDeletingVaccination(vaccination);
  }

  function handleConfirmDelete() {
    if (!deletingVaccination) return;
    deleteVaccination(deletingVaccination.id);
    setDeletingVaccination(null);
  }

  const hasActiveFilters = search.trim() !== "" || petFilter !== ALL_PETS_VALUE || vetFilter !== ALL_VETS_VALUE;

  return (
    <section className="space-y-12" data-testid="vaccinations-section">
      
      {/* Header & Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {petId ? "Vaccinations" : "My Vaccinations"}
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {activeVaccinations.length} active record{activeVaccinations.length === 1 ? "" : "s"}
            {!petId && hasActiveFilters && " found"}
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleAddClick}
          disabled={!petId && ownPets.length === 0}
          className="w-full sm:w-auto"
          data-testid="add-vaccination-btn"
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Add Vaccination
        </Button>
      </div>

      {/* Filters Row */}
      {!petId && scopedVaccinations.length > 0 && (
        <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center" data-testid="vaccination-filters">
          <div className="flex-1 min-w-[200px]">
            <VaccinationSearchBar value={search} onChange={setSearch} />
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

      {/* Active Vaccinations */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Active</h3>
        <div className="mt-4">
          {activeVaccinations.length === 0 ? (
            <div data-testid="empty-active-vaccinations">
              <EmptyState
                icon={Syringe}
                title={hasActiveFilters ? "No vaccinations found" : "No active vaccinations"}
                description={
                  hasActiveFilters
                    ? "Try a different search term or filter combination."
                    : "Add a vaccination to start tracking due dates."
                }
              />
            </div>
          ) : (
            <div className="space-y-4" data-testid="active-vaccinations-list">
              {activeVaccinations.map((v) => (
                <VaccinationListItem
                  key={v.id}
                  vaccination={v}
                  petName={petsById[v.petId]?.name}
                  showPetName={!petId}
                  highlighted={v.id === highlightId}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onComplete={handleCompleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Vaccination History */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">History</h3>
        <div className="mt-4">
          {historyVaccinations.length === 0 ? (
            <div data-testid="empty-history-vaccinations">
              <EmptyState
                icon={Syringe}
                title="No completed vaccinations yet"
                description="Completed vaccinations will appear here."
              />
            </div>
          ) : (
            <div className="space-y-4" data-testid="history-vaccinations-list">
              {historyVaccinations.map((v) => (
                <VaccinationListItem
                  key={v.id}
                  vaccination={v}
                  petName={petsById[v.petId]?.name}
                  showPetName={!petId}
                  highlighted={v.id === highlightId}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onComplete={handleCompleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <VaccinationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vaccination={editingVaccination}
        onSubmit={handleFormSubmit}
      />

      <CompleteVaccinationDialog
        open={!!completingVaccination}
        onOpenChange={(open) => !open && setCompletingVaccination(null)}
        vaccination={completingVaccination}
        onConfirm={handleConfirmComplete}
      />

      <DeleteVaccinationDialog
        open={!!deletingVaccination}
        onOpenChange={(open) => !open && setDeletingVaccination(null)}
        vaccination={deletingVaccination}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}