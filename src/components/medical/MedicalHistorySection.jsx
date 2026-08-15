"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useMedicalRecordStore } from "@/store/medicalRecordStore";
import { Button } from "@/components/ui/button";
import MedicalTimeline from "./MedicalTimeline";
import MedicalRecordFormDialog from "./MedicalRecordFormDialog";
import DeleteMedicalRecordDialog from "./DeleteMedicalRecordDialog";
import { parseDateOnly } from "@/utils/dateUtils";

export default function MedicalHistorySection({ petId }) {
  const allRecords = useMedicalRecordStore((state) => state.medicalRecords);
  const addMedicalRecord = useMedicalRecordStore((state) => state.addMedicalRecord);
  const updateMedicalRecord = useMedicalRecordStore((state) => state.updateMedicalRecord);
  const deleteMedicalRecord = useMedicalRecordStore((state) => state.deleteMedicalRecord);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);

  // Newest first. When multiple records share the same date, fall back
  // to insertion order (by id) so the sort stays stable and predictable.
  const records = useMemo(() => {
    return allRecords
      .filter((r) => r.petId === petId)
      .sort((a, b) => {
        const dateDiff = parseDateOnly(b.date) - parseDateOnly(a.date);
        if (dateDiff !== 0) return dateDiff;
        return a.id.localeCompare(b.id);
      });
  }, [allRecords, petId]);

  function handleAddClick() {
    setEditingRecord(null);
    setFormOpen(true);
  }

  function handleEditClick(record) {
    setEditingRecord(record);
    setFormOpen(true);
  }

  function handleFormSubmit(data) {
    if (editingRecord) {
      updateMedicalRecord(editingRecord.id, data);
    } else {
      addMedicalRecord(petId, data);
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

  return (
    <div className="space-y-6" data-testid="medical-history-section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Medical History
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {records.length} record{records.length === 1 ? "" : "s"} on file
          </p>
        </div>
        <Button size="sm" onClick={handleAddClick} data-testid="add-record-btn" className="w-full sm:w-auto">
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Add Record
        </Button>
      </div>

      <div className="pt-2">
        <MedicalTimeline
          records={records}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      <MedicalRecordFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        record={editingRecord}
        onSubmit={handleFormSubmit}
      />

      <DeleteMedicalRecordDialog
        open={!!deletingRecord}
        onOpenChange={(open) => !open && setDeletingRecord(null)}
        record={deletingRecord}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}