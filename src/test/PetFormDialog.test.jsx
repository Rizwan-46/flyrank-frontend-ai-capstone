import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import PetFormDialog from "@/components/pets/PetFormDialog";

describe("PetFormDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    pet: null,
    onSubmit: vi.fn(),
  };

  it("renders 'Add a New Pet' title and input fields in add mode", () => {
    render(<PetFormDialog {...defaultProps} />);

    expect(screen.getByRole("heading", { name: /add a new pet/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add pet/i })).toBeInTheDocument();
  });

  it("pre-populates fields and shows 'Edit Pet Profile' in edit mode", () => {
    const existingPet = {
      id: "pet-1",
      name: "Rocky",
      species: "Dog",
      breed: "German Shepherd",
      gender: "Male",
      dateOfBirth: "2021-06-15",
      weight: 32.5,
      allergies: ["Chicken", "Pollen"],
      microchipId: "CHIP-9988",
      notes: "Friendly and energetic",
    };

    render(<PetFormDialog {...defaultProps} pet={existingPet} />);

    expect(screen.getByRole("heading", { name: /edit pet profile/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue("Rocky");
    expect(screen.getByLabelText(/species/i)).toHaveValue("Dog");
    expect(screen.getByLabelText(/breed/i)).toHaveValue("German Shepherd");
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue("2021-06-15");
    expect(screen.getByLabelText(/weight/i)).toHaveValue(32.5);
    expect(screen.getByLabelText(/allergies/i)).toHaveValue("Chicken, Pollen");
    expect(screen.getByLabelText(/microchip id/i)).toHaveValue("CHIP-9988");
    expect(screen.getByLabelText(/additional notes/i)).toHaveValue("Friendly and energetic");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("displays validation error messages when submitting empty required fields", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<PetFormDialog {...defaultProps} onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole("button", { name: /add pet/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveAttribute("aria-invalid", "true");
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits properly formatted payload and closes dialog on valid submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <PetFormDialog
        {...defaultProps}
        onSubmit={handleSubmit}
        onOpenChange={handleOpenChange}
      />
    );

    await user.type(screen.getByLabelText(/name/i), "Bella");
    await user.type(screen.getByLabelText(/species/i), "Dog");
    await user.type(screen.getByLabelText(/breed/i), "Labrador");
    await user.type(screen.getByLabelText(/date of birth/i), "2022-04-10");
    await user.type(screen.getByLabelText(/weight/i), "25.4");
    await user.type(screen.getByLabelText(/allergies/i), "Beef, Dairy");
    await user.type(screen.getByLabelText(/microchip id/i), "9851410");

    // Select Gender using Radix Select trigger
    const genderTrigger = screen.getByRole("combobox", { name: /gender/i });
    await user.click(genderTrigger);
    const femaleOption = await screen.findByRole("option", { name: "Female" });
    await user.click(femaleOption);

    const submitBtn = screen.getByRole("button", { name: /add pet/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Bella",
        species: "Dog",
        breed: "Labrador",
        gender: "Female",
        dateOfBirth: "2022-04-10",
        weight: 25.4,
        allergies: ["Beef", "Dairy"],
        microchipId: "9851410",
      })
    );
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("invokes onOpenChange(false) when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(<PetFormDialog {...defaultProps} onOpenChange={handleOpenChange} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});