"use client";

import { useEffect, useState } from "react";
import { appointmentSchema } from "@/schemas/appointmentSchema";
import { zodErrorsToFieldMap } from "@/utils/formErrors";
import { getTodayDateOnly, parseDateOnly } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock } from "lucide-react";
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

function emptyForm(lockedPetId) {
  return {
    petId: lockedPetId ?? "",
    date: "",
    time: "",
    reason: "",
    veterinarian: "",
    notes: "",
  };
}

export default function AppointmentFormDialog({
  open,
  onOpenChange,
  appointment,
  pets,
  lockedPetId,
  onSubmit,
}) {
  const [formData, setFormData] = useState(emptyForm(lockedPetId));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(appointment);

  useEffect(() => {
    if (!open) return;
    if (appointment) {
      setFormData({
        petId: appointment.petId ?? "",
        date: appointment.date ?? "",
        time: appointment.time ?? "",
        reason: appointment.reason ?? "",
        veterinarian: appointment.veterinarian ?? "",
        notes: appointment.notes ?? "",
      });
    } else {
      setFormData(emptyForm(lockedPetId));
    }
    setErrors({});
  }, [open, appointment, lockedPetId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handlePetChange(value) {
    setFormData((prev) => ({ ...prev, petId: value }));
    setErrors((prev) => ({ ...prev, petId: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = appointmentSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodErrorsToFieldMap(result.error));
      return;
    }

    if (!isEditMode) {
      const today = getTodayDateOnly();
      if (parseDateOnly(result.data.date) < today) {
        setErrors((prev) => ({
          ...prev,
          date: "Appointments cannot be scheduled in the past.",
        }));
        return;
      }
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
        data-testid="appointment-form-dialog"
      >
        <DialogHeader className="mb-2 flex flex-row items-center gap-4 space-y-0 text-left">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 sm:flex">
            <CalendarClock className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl" data-testid="dialog-title">
              {isEditMode ? "Edit Appointment" : "Add Appointment"}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-base">
              {isEditMode
                ? "Update this appointment's details."
                : "Schedule a vet appointment. Fields marked with an asterisk are required."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 pt-4" data-testid="appointment-form">
          {!lockedPetId && (
            <div className="space-y-2">
              <Label htmlFor="petId" className="text-sm font-medium text-foreground/90">
                Pet <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.petId} onValueChange={handlePetChange}>
                <SelectTrigger id="petId" aria-invalid={!!errors.petId} className="bg-background shadow-sm" data-testid="select-pet">
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
              {errors.petId && (
                <p className="text-xs font-medium text-destructive">{errors.petId}</p>
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
              <Label htmlFor="time" className="text-sm font-medium text-foreground/90">
                Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                aria-invalid={!!errors.time}
                className="bg-background shadow-sm"
                data-testid="input-time"
              />
              {errors.time && (
                <p className="text-xs font-medium text-destructive">{errors.time}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-foreground/90">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reason"
              name="reason"
              placeholder="e.g. Routine checkup, vaccination..."
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
              placeholder="Any special instructions or concerns to bring up..."
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
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Add Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}