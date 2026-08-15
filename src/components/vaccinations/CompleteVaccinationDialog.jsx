"use client";

import { useEffect, useState } from "react";
import { completeVaccinationSchema } from "@/schemas/vaccinationSchema";
import { zodErrorsToFieldMap } from "@/utils/formErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

function todayISO() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString()
    .slice(0, 10);
}

export default function CompleteVaccinationDialog({
  open,
  onOpenChange,
  vaccination,
  onConfirm,
}) {
  const [formData, setFormData] = useState({
    administeredDate: "",
    nextDueDate: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ administeredDate: todayISO(), nextDueDate: "" });
      setErrors({});
    }
  }, [open]);

  if (!vaccination) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = completeVaccinationSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodErrorsToFieldMap(result.error));
      return;
    }

    setIsSubmitting(true);
    onConfirm(result.data);
    setIsSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[450px]"
        data-testid="complete-vaccination-dialog"
      >
        <DialogHeader className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold">
              Mark as Completed
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm leading-relaxed">
              Confirm the date <span className="font-semibold text-foreground">&quot;{vaccination.name}&quot;</span> was administered and when the
              next one is due.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-5" data-testid="complete-vaccination-form">
          <div className="space-y-2">
            <Label htmlFor="complete-administeredDate" className="text-sm font-medium text-foreground/90">
              Administered Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="complete-administeredDate"
              name="administeredDate"
              type="date"
              value={formData.administeredDate}
              onChange={handleChange}
              aria-invalid={!!errors.administeredDate}
              className="bg-background shadow-sm"
              data-testid="input-complete-administered"
            />
            {errors.administeredDate && (
              <p className="text-xs font-medium text-destructive">
                {errors.administeredDate}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="complete-nextDueDate" className="text-sm font-medium text-foreground/90">
              Next Due Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="complete-nextDueDate"
              name="nextDueDate"
              type="date"
              value={formData.nextDueDate}
              onChange={handleChange}
              aria-invalid={!!errors.nextDueDate}
              className="bg-background shadow-sm"
              data-testid="input-complete-next-due"
            />
            {errors.nextDueDate && (
              <p className="text-xs font-medium text-destructive">{errors.nextDueDate}</p>
            )}
          </div>

          <DialogFooter className="mt-6 pt-2 sm:mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
              data-testid="cancel-complete-btn"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              data-testid="submit-complete-btn"
            >
              {isSubmitting ? "Saving..." : "Mark as Completed"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}