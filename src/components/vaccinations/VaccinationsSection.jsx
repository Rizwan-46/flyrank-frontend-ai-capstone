"use client";

import { useMemo, useState } from "react";
import { Plus, Syringe } from "lucide-react";
import { useVaccinationStore } from "@/store/vaccinationStore";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/dashboard/EmptyState";
import VaccinationListItem from "./VaccinationListItem";
import VaccinationFormDialog from "./VaccinationFormDialog";
import CompleteVaccinationDialog from "./CompleteVaccinationDialog";
import DeleteVaccinationDialog from "./DeleteVaccinationDialog";
import { parseDateOnly } from "@/utils/dateUtils";
import { getVaccinationStatus } from "@/utils/vaccinationStatus";
import { VACCINATION_STATUS } from "@/utils/statusColors";

export default function VaccinationsSection({ petId }) {
  const allVaccinations = useVaccinationStore((state) => state.vaccinations);
  const addVaccination = useVaccinationStore((state) => state.addVaccination);
  const updateVaccination = useVaccinationStore((state) => state.updateVaccination);
  const deleteVaccination = useVaccinationStore((state) => state.deleteVaccination);
  const completeVaccination = useVaccinationStore((state) => state.completeVaccination);

  const [formOpen, setFormOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [completingVaccination, setCompletingVaccination] = useState(null);
  const [deletingVaccination, setDeletingVaccination] = useState(null);

  const petVaccinations = useMemo(
    () => allVaccinations.filter((v) => v.petId === petId),
    [allVaccinations, petId]
  );

  const activeVaccinations = useMemo(() => {
    return petVaccinations
      .filter((v) => getVaccinationStatus(v) !== VACCINATION_STATUS.COMPLETED)
      .sort((a, b) => parseDateOnly(a.nextDueDate) - parseDateOnly(b.nextDueDate));
  }, [petVaccinations]);

  const historyVaccinations = useMemo(() => {
    return petVaccinations
      .filter((v) => getVaccinationStatus(v) === VACCINATION_STATUS.COMPLETED)
      .sort(
        (a, b) => parseDateOnly(b.administeredDate) - parseDateOnly(a.administeredDate)
      );
  }, [petVaccinations]);

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

  return (
    <section className="space-y-12" data-testid="vaccinations-section">
      
      {/* Active Vaccinations */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Active Vaccinations
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {activeVaccinations.length} active record{activeVaccinations.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button size="sm" onClick={handleAddClick} data-testid="add-vaccination-btn" className="w-full sm:w-auto">
            <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Add Vaccination
          </Button>
        </div>

        <div className="mt-6">
          {activeVaccinations.length === 0 ? (
            <div data-testid="empty-active-vaccinations">
              <EmptyState
                icon={Syringe}
                title="No active vaccinations"
                description="Add a vaccination to start tracking due dates."
              />
            </div>
          ) : (
            <div className="space-y-4" data-testid="active-vaccinations-list">
              {activeVaccinations.map((v) => (
                <VaccinationListItem
                  key={v.id}
                  vaccination={v}
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
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Vaccination History
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {historyVaccinations.length} completed record{historyVaccinations.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="mt-6">
          {historyVaccinations.length === 0 ? (
            <div data-testid="empty-history-vaccinations">
              <EmptyState
                icon={Syringe}
                title="No completed vaccinations yet"
                description="Vaccinations marked as completed will appear here."
              />
            </div>
          ) : (
            <div className="space-y-4" data-testid="history-vaccinations-list">
              {historyVaccinations.map((v) => (
                <VaccinationListItem
                  key={v.id}
                  vaccination={v}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onComplete={handleCompleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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