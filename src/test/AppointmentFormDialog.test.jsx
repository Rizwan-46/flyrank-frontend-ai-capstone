import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AppointmentFormDialog from "@/components/appointments/AppointmentFormDialog";

const mockPets = [
  { id: "pet-1", name: "Rocky" },
  { id: "pet-2", name: "Milo" },
];

describe("AppointmentFormDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    appointment: null,
    pets: mockPets,
    lockedPetId: null,
    onSubmit: vi.fn(),
  };

  it("renders 'Add Appointment' and empty inputs in create mode", () => {
    render(<AppointmentFormDialog {...defaultProps} />);

    expect(screen.getByRole("heading", { name: /add appointment/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /pet/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/veterinarian/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add appointment/i })).toBeInTheDocument();
  });

  it("hides the pet selector when lockedPetId is provided", () => {
    render(<AppointmentFormDialog {...defaultProps} lockedPetId="pet-1" />);

    expect(screen.queryByRole("combobox", { name: /pet/i })).not.toBeInTheDocument();
  });

  it("populates form fields and shows 'Edit Appointment' in edit mode", () => {
    const existingAppointment = {
      id: "apt-1",
      petId: "pet-1",
      date: "2026-10-15",
      time: "10:30",
      reason: "Annual Checkup",
      veterinarian: "Dr. Smith",
      notes: "Routine vaccination boosters",
    };

    render(<AppointmentFormDialog {...defaultProps} appointment={existingAppointment} />);

    expect(screen.getByRole("heading", { name: /edit appointment/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toHaveValue("2026-10-15");
    expect(screen.getByLabelText(/time/i)).toHaveValue("10:30");
    expect(screen.getByLabelText(/reason/i)).toHaveValue("Annual Checkup");
    expect(screen.getByLabelText(/veterinarian/i)).toHaveValue("Dr. Smith");
    expect(screen.getByLabelText(/notes/i)).toHaveValue("Routine vaccination boosters");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("displays validation error when required fields are submitted blank", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<AppointmentFormDialog {...defaultProps} onSubmit={handleSubmit} />);

    const submitBtn = screen.getByRole("button", { name: /add appointment/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/date/i)).toHaveAttribute("aria-invalid", "true");
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("blocks scheduling in the past during new appointment creation", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<AppointmentFormDialog {...defaultProps} lockedPetId="pet-1" onSubmit={handleSubmit} />);

    // Fill valid values except a past date
    await user.type(screen.getByLabelText(/date/i), "2020-01-01");
    await user.type(screen.getByLabelText(/time/i), "09:00");
    await user.type(screen.getByLabelText(/reason/i), "Dental Cleaning");
    await user.type(screen.getByLabelText(/veterinarian/i), "Dr. Adams");

    const submitBtn = screen.getByRole("button", { name: /add appointment/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Appointments cannot be scheduled in the past.")
      ).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid appointment payload and closes dialog on success", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <AppointmentFormDialog
        {...defaultProps}
        onSubmit={handleSubmit}
        onOpenChange={handleOpenChange}
      />
    );

    // Select Pet
    const petTrigger = screen.getByRole("combobox", { name: /pet/i });
    await user.click(petTrigger);
    const petOption = await screen.findByRole("option", { name: "Rocky" });
    await user.click(petOption);

    // Fill future date and required inputs
    await user.type(screen.getByLabelText(/date/i), "2026-11-20");
    await user.type(screen.getByLabelText(/time/i), "14:00");
    await user.type(screen.getByLabelText(/reason/i), "Follow-up consultation");
    await user.type(screen.getByLabelText(/veterinarian/i), "Dr. Adams");
    await user.type(screen.getByLabelText(/notes/i), "Check healing progress");

    const submitBtn = screen.getByRole("button", { name: /add appointment/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        petId: "pet-1",
        date: "2026-11-20",
        time: "14:00",
        reason: "Follow-up consultation",
        veterinarian: "Dr. Adams",
        notes: "Check healing progress",
      })
    );
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("triggers onOpenChange(false) when clicking Cancel", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(<AppointmentFormDialog {...defaultProps} onOpenChange={handleOpenChange} />);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});