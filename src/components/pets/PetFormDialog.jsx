"use client";

import { useEffect, useState } from "react";
import { petSchema } from "@/schemas/petSchema";
import { zodErrorsToFieldMap } from "@/utils/formErrors";
import { stringToAllergies, allergiesToString } from "@/utils/petUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PawPrint } from "lucide-react";
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

const emptyForm = {
  name: "",
  species: "",
  breed: "",
  gender: "",
  dateOfBirth: "",
  weight: "",
  allergies: "",
  microchipId: "",
  notes: "",
};

export default function PetFormDialog({ open, onOpenChange, pet, onSubmit }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(pet);

  useEffect(() => {
    if (!open) return;
    if (pet) {
      setFormData({
        name: pet.name ?? "",
        species: pet.species ?? "",
        breed: pet.breed ?? "",
        gender: pet.gender ?? "",
        dateOfBirth: pet.dateOfBirth ?? "",
        weight: pet.weight != null ? String(pet.weight) : "",
        allergies: allergiesToString(pet.allergies),
        microchipId: pet.microchipId ?? "",
        notes: pet.notes ?? "",
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [open, pet]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleGenderChange(value) {
    setFormData((prev) => ({ ...prev, gender: value }));
    setErrors((prev) => ({ ...prev, gender: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = petSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodErrorsToFieldMap(result.error));
      return;
    }

    setIsSubmitting(true);
    onSubmit({
      ...result.data,
      allergies: stringToAllergies(result.data.allergies),
      microchipId: result.data.microchipId || null,
    });
    setIsSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-[600px] sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <DialogHeader className="mb-2 flex flex-row items-center gap-4 space-y-0 text-left">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 sm:flex">
            <PawPrint className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl">
              {isEditMode ? "Edit Pet Profile" : "Add a New Pet"}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-base">
              {isEditMode
                ? "Update your pet's information below."
                : "Fill in your pet's details. Fields marked with an asterisk are required."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 pt-4">
          
          {/* Core Info Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground/90">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Bella"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                className="bg-background shadow-sm"
              />
              {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="species" className="text-sm font-medium text-foreground/90">
                Species <span className="text-destructive">*</span>
              </Label>
              <Input
                id="species"
                name="species"
                placeholder="Dog, Cat, Rabbit..."
                value={formData.species}
                onChange={handleChange}
                aria-invalid={!!errors.species}
                className="bg-background shadow-sm"
              />
              {errors.species && <p className="text-xs font-medium text-destructive">{errors.species}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed" className="text-sm font-medium text-foreground/90">
                Breed <span className="text-destructive">*</span>
              </Label>
              <Input
                id="breed"
                name="breed"
                placeholder="e.g. Golden Retriever"
                value={formData.breed}
                onChange={handleChange}
                aria-invalid={!!errors.breed}
                className="bg-background shadow-sm"
              />
              {errors.breed && <p className="text-xs font-medium text-destructive">{errors.breed}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-foreground/90">
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.gender} onValueChange={handleGenderChange}>
                <SelectTrigger id="gender" aria-invalid={!!errors.gender} className="bg-background shadow-sm">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs font-medium text-destructive">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground/90">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                aria-invalid={!!errors.dateOfBirth}
                className="bg-background shadow-sm"
              />
              {errors.dateOfBirth && <p className="text-xs font-medium text-destructive">{errors.dateOfBirth}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-foreground/90">
                Weight (kg) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.weight}
                onChange={handleChange}
                aria-invalid={!!errors.weight}
                className="bg-background shadow-sm"
              />
              {errors.weight && <p className="text-xs font-medium text-destructive">{errors.weight}</p>}
            </div>
            
          </div>

          <hr className="border-border/50" />

          {/* Additional Info */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-sm font-medium text-foreground/90">
                Allergies
              </Label>
              <Input
                id="allergies"
                name="allergies"
                placeholder="Comma-separated (e.g. Chicken, Pollen)"
                value={formData.allergies}
                onChange={handleChange}
                className="bg-background shadow-sm"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank if your pet has no known allergies.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="microchipId" className="text-sm font-medium text-foreground/90">
                Microchip ID
              </Label>
              <Input
                id="microchipId"
                name="microchipId"
                placeholder="Optional ID number"
                value={formData.microchipId}
                onChange={handleChange}
                className="bg-background shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground/90">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Any special quirks, behaviors, or medical history..."
                value={formData.notes}
                onChange={handleChange}
                className="resize-none bg-background shadow-sm"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3 sm:gap-0 pt-4 border-t border-border/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Pet"}
            </Button>
          </DialogFooter>
          
        </form>
      </DialogContent>
    </Dialog>
  );
}