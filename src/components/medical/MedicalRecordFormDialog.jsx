"use client";

import { useEffect, useState } from "react";
import { medicalRecordSchema } from "@/schemas/medicalRecordSchema";
import { zodErrorsToFieldMap } from "@/utils/formErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const NOTES_MAX = 2000;

const emptyForm = {
  date: "",
  reason: "",
  diagnosis: "",
  treatment: "",
  veterinarian: "",
  notes: "",
};

export default function MedicalRecordFormDialog({
  open,
  onOpenChange,
  record,
  pets = [],
  lockedPetId = null,
  selectedPetId,
  onPetChange,
  onSubmit,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [petError, setPetError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(record);

  useEffect(() => {
    if (!open) return;
    if (record) {
      setFormData({
        date: record.date ?? "",
        reason: record.reason ?? "",
        diagnosis: record.diagnosis ?? "",
        treatment: record.treatment ?? "",
        veterinarian: record.veterinarian ?? "",
        notes: record.notes ?? "",
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    setPetError("");
  }, [open, record]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!lockedPetId && !selectedPetId) {
      setPetError("Please select a pet.");
      return;
    }

    const result = medicalRecordSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodErrorsToFieldMap(result.error));
      return;
    }

    setIsSubmitting(true);
    onSubmit(result.data);
    setIsSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-[600px] sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        data-testid="medical-record-dialog"
      >
        <DialogHeader className="mb-2 flex flex-row items-center gap-4 space-y-0 text-left">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 sm:flex">
            <Stethoscope className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl" data-testid="dialog-title">
              {isEditMode ? "Edit Medical Record" : "Add Medical Record"}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-base">
              {isEditMode
                ? "Update the details of this visit."
                : "Record the details of a vet visit. Fields marked with an asterisk are required."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 pt-4" data-testid="medical-record-form">
          {!lockedPetId && !isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="petId" className="text-sm font-medium text-foreground/90">
                Pet <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedPetId ?? ""} onValueChange={onPetChange}>
                <SelectTrigger id="petId" aria-invalid={!!petError} className="bg-background shadow-sm" data-testid="select-pet">
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {petError && (
                <p className="text-xs font-medium text-destructive">{petError}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-foreground/90">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                aria-invalid={!!errors.date}
                className="bg-background shadow-sm"
                data-testid="input-date"
              />
              {errors.date && (
                <p className="text-xs font-medium text-destructive">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="veterinarian" className="text-sm font-medium text-foreground/90">
                Veterinarian <span className="text-destructive">*</span>
              </Label>
              <Input
                id="veterinarian"
                name="veterinarian"
                placeholder="Dr. Smith"
                value={formData.veterinarian}
                onChange={handleChange}
                aria-invalid={!!errors.veterinarian}
                className="bg-background shadow-sm"
                data-testid="input-veterinarian"
              />
              {errors.veterinarian && (
                <p className="text-xs font-medium text-destructive">{errors.veterinarian}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-foreground/90">
              Visit / Reason <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reason"
              name="reason"
              placeholder="e.g. Routine checkup, skin irritation..."
              value={formData.reason}
              onChange={handleChange}
              aria-invalid={!!errors.reason}
              className="bg-background shadow-sm"
              data-testid="input-reason"
            />
            {errors.reason && (
              <p className="text-xs font-medium text-destructive">{errors.reason}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="text-sm font-medium text-foreground/90">
              Diagnosis <span className="text-destructive">*</span>
            </Label>
            <Input
              id="diagnosis"
              name="diagnosis"
              placeholder="e.g. Healthy, Mild dermatitis"
              value={formData.diagnosis}
              onChange={handleChange}
              aria-invalid={!!errors.diagnosis}
              className="bg-background shadow-sm"
              data-testid="input-diagnosis"
            />
            {errors.diagnosis && (
              <p className="text-xs font-medium text-destructive">{errors.diagnosis}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment" className="text-sm font-medium text-foreground/90">
              Treatment <span className="text-destructive">*</span>
            </Label>
            <Input
              id="treatment"
              name="treatment"
              placeholder="e.g. None, Prescribed topical cream"
              value={formData.treatment}
              onChange={handleChange}
              aria-invalid={!!errors.treatment}
              className="bg-background shadow-sm"
              data-testid="input-treatment"
            />
            {errors.treatment && (
              <p className="text-xs font-medium text-destructive">{errors.treatment}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground/90">
                Notes
              </Label>
              <span
                className={`text-xs font-medium ${
                  formData.notes.length > NOTES_MAX
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
                data-testid="notes-counter"
              >
                {formData.notes.length} / {NOTES_MAX}
              </span>
            </div>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={handleChange}
              aria-invalid={!!errors.notes}
              className="resize-none bg-background shadow-sm"
              data-testid="input-notes"
            />
            {errors.notes && (
              <p className="text-xs font-medium text-destructive">{errors.notes}</p>
            )}
          </div>

          <DialogFooter className="mt-8 gap-3 border-t border-border/50 pt-4 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
              data-testid="cancel-btn"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              data-testid="submit-btn"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}