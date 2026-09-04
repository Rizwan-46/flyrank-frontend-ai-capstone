import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import VaccinationFormDialog from "@/components/vaccinations/VaccinationFormDialog";

describe("VaccinationFormDialog", () => {
  it("does not show its content when closed", () => {
    render(
      <VaccinationFormDialog
        open={false}
        onOpenChange={vi.fn()}
        vaccination={null}
        lockedPetId="pet-1"
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByRole("heading", { name: "Add Vaccination" })).not.toBeInTheDocument();
  });

  it("shows the form with required fields when open", async () => {
    render(
      <VaccinationFormDialog
        open={true}
        onOpenChange={vi.fn()}
        vaccination={null}
        lockedPetId="pet-1"
        onSubmit={vi.fn()}
      />
    );

    expect(
      await screen.findByRole("heading", { name: "Add Vaccination" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/vaccination name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/administered date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/veterinarian/i)).toBeInTheDocument();
  });

  it("shows validation errors and does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <VaccinationFormDialog
        open={true}
        onOpenChange={vi.fn()}
        vaccination={null}
        lockedPetId="pet-1"
        onSubmit={onSubmit}
      />
    );

    const submitButton = await screen.findByRole("button", { name: /add vaccination/i });
    await user.click(submitButton);

    expect(await screen.findByText(/vaccination name is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the entered data when all required fields are valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <VaccinationFormDialog
        open={true}
        onOpenChange={onOpenChange}
        vaccination={null}
        lockedPetId="pet-1"
        onSubmit={onSubmit}
      />
    );

    await user.type(await screen.findByLabelText(/vaccination name/i), "Rabies");
    await user.type(screen.getByLabelText(/administered date/i), "2024-01-01");
    await user.type(screen.getByLabelText(/next due date/i), "2024-06-01");
    await user.type(screen.getByLabelText(/veterinarian/i), "Dr. Smith");

    await user.click(screen.getByRole("button", { name: /add vaccination/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Rabies",
        administeredDate: "2024-01-01",
        nextDueDate: "2024-06-01",
        veterinarian: "Dr. Smith",
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes without submitting when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <VaccinationFormDialog
        open={true}
        onOpenChange={onOpenChange}
        vaccination={null}
        lockedPetId="pet-1"
        onSubmit={onSubmit}
      />
    );

    await user.click(await screen.findByRole("button", { name: /cancel/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("pre-fills fields with existing data in edit mode", async () => {
    const existingVaccination = {
      id: "vax-1",
      petId: "pet-1",
      name: "DHPP",
      administeredDate: "2024-02-15",
      nextDueDate: "2025-02-15",
      veterinarian: "Dr. Lee",
      notes: "Annual booster",
    };

    render(
      <VaccinationFormDialog
        open={true}
        onOpenChange={vi.fn()}
        vaccination={existingVaccination}
        lockedPetId="pet-1"
        onSubmit={vi.fn()}
      />
    );

    expect(
      await screen.findByRole("heading", { name: "Edit Vaccination" })
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("DHPP")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dr. Lee")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});