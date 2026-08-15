"use client";

import { useEffect, useState } from "react";
import { vaccinationSchema } from "@/schemas/vaccinationSchema";
import { zodErrorsToFieldMap } from "@/utils/formErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Syringe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const emptyForm = {
  name: "",
  administeredDate: "",
  nextDueDate: "",
  veterinarian: "",
  notes: "",
};

export default function VaccinationFormDialog({
  open,
  onOpenChange,
  vaccination,
  onSubmit,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(vaccination);

  useEffect(() => {
    if (!open) return;
    if (vaccination) {
      setFormData({
        name: vaccination.name ?? "",
        administeredDate: vaccination.administeredDate ?? "",
        nextDueDate: vaccination.nextDueDate ?? "",
        veterinarian: vaccination.veterinarian ?? "",
        notes: vaccination.notes ?? "",
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [open, vaccination]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = vaccinationSchema.safeParse(formData);
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
        data-testid="vaccination-form-dialog"
      >
        <DialogHeader className="mb-2 flex flex-row items-center gap-4 space-y-0 text-left">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 sm:flex">
            <Syringe className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl" data-testid="dialog-title">
              {isEditMode ? "Edit Vaccination" : "Add Vaccination"}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-base">
              {isEditMode
                ? "Update this vaccination's details."
                : "Record a vaccination. Fields marked with an asterisk are required."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 pt-4" data-testid="vaccination-form">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground/90">
              Vaccination Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Rabies, DHPP..."
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              className="bg-background shadow-sm"
              data-testid="input-name"
            />
            {errors.name && (
              <p className="text-xs font-medium text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="administeredDate" className="text-sm font-medium text-foreground/90">
                Administered Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="administeredDate"
                name="administeredDate"
                type="date"
                value={formData.administeredDate}
                onChange={handleChange}
                aria-invalid={!!errors.administeredDate}
                className="bg-background shadow-sm"
                data-testid="input-administered-date"
              />
              {errors.administeredDate && (
                <p className="text-xs font-medium text-destructive">
                  {errors.administeredDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextDueDate" className="text-sm font-medium text-foreground/90">
                Next Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nextDueDate"
                name="nextDueDate"
                type="date"
                value={formData.nextDueDate}
                onChange={handleChange}
                aria-invalid={!!errors.nextDueDate}
                className="bg-background shadow-sm"
                data-testid="input-next-due-date"
              />
              {errors.nextDueDate && (
                <p className="text-xs font-medium text-destructive">{errors.nextDueDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarian" className="text-sm font-medium text-foreground/90">
              Veterinarian <span className="text-destructive">*</span>
            </Label>
            <Input
              id="veterinarian"
              name="veterinarian"
              placeholder="Dr. Smith or Clinic Name"
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

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-foreground/90">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Batch number, side effects, etc..."
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
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Vaccination"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}