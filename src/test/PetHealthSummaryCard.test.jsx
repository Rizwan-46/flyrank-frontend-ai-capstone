import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PetHealthSummaryCard from "@/components/ai/PetHealthSummaryCard";

vi.mock("next/link", () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe("PetHealthSummaryCard", () => {
  it("renders nothing when there is no result", () => {
    const { container } = render(<PetHealthSummaryCard result={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a not-found message with a link to view pets when the pet doesn't exist", () => {
    render(
      <PetHealthSummaryCard
        result={{ notFound: true, message: "No pet was found with that id." }}
      />
    );

    expect(screen.getByText("No pet was found with that id.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view my pets/i })).toHaveAttribute(
      "href",
      "/dashboard/pets"
    );
  });

  it("shows the pet's name, species, and a 'Needs Attention' badge when overdue", () => {
    render(
      <PetHealthSummaryCard
        result={{
          pet: { id: "pet-1", name: "Rocky", species: "Dog", breed: "German Shepherd" },
          healthStatus: "needs-attention",
          vaccinations: { completed: 3, overdue: 1, upcoming: 1 },
          upcomingAppointment: null,
          recentMedicalRecords: [],
        }}
      />
    );

    expect(screen.getByText("Rocky")).toBeInTheDocument();
    expect(screen.getByText(/German Shepherd/)).toBeInTheDocument();
    expect(screen.getByText("Needs Attention")).toBeInTheDocument();
  });

  it("shows a 'Good' badge when there are no overdue vaccinations", () => {
    render(
      <PetHealthSummaryCard
        result={{
          pet: { id: "pet-2", name: "Milo", species: "Cat", breed: "British Shorthair" },
          healthStatus: "good",
          vaccinations: { completed: 4, overdue: 0, upcoming: 1 },
          upcomingAppointment: null,
          recentMedicalRecords: [],
        }}
      />
    );

    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.queryByText("Needs Attention")).not.toBeInTheDocument();
  });

  it("shows the vaccination counts", () => {
    render(
      <PetHealthSummaryCard
        result={{
          pet: { id: "pet-1", name: "Rocky", species: "Dog", breed: "German Shepherd" },
          healthStatus: "needs-attention",
          vaccinations: { completed: 3, overdue: 1, upcoming: 2 },
          upcomingAppointment: null,
          recentMedicalRecords: [],
        }}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });

  it("shows the appointment date and reason when one is scheduled", () => {
    render(
      <PetHealthSummaryCard
        result={{
          pet: { id: "pet-1", name: "Rocky", species: "Dog", breed: "German Shepherd" },
          healthStatus: "good",
          vaccinations: { completed: 4, overdue: 0, upcoming: 0 },
          upcomingAppointment: { date: "2026-08-30", reason: "Annual Checkup" },
          recentMedicalRecords: [],
        }}
      />
    );

    expect(screen.getByText(/annual checkup/i)).toBeInTheDocument();
  });

  it("says no appointment is scheduled when there isn't one", () => {
    render(
      <PetHealthSummaryCard
        result={{
          pet: { id: "pet-1", name: "Rocky", species: "Dog", breed: "German Shepherd" },
          healthStatus: "good",
          vaccinations: { completed: 4, overdue: 0, upcoming: 0 },
          upcomingAppointment: null,
          recentMedicalRecords: [],
        }}
      />
    );

    expect(screen.getByText(/no upcoming appointment scheduled/i)).toBeInTheDocument();
  });

  it("lists recent medical records when present, and hides the section when empty", () => {
    const { rerender } = render(
      <PetHealthSummaryCard
        result={{
          pet: { id: "pet-1", name: "Rocky", species: "Dog", breed: "German Shepherd" },
          healthStatus: "good",
          vaccinations: { completed: 4, overdue: 0, upcoming: 0 },
          upcomingAppointment: null,
          recentMedicalRecords: [{ date: "2026-07-05", diagnosis: "Healthy", notes: "" }],
        }}
      />
    );

    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.getByText(/recent medical records/i)).toBeInTheDocument();

    rerender(
      <PetHealthSummaryCard
        result={{
          pet: { id: "pet-1", name: "Rocky", species: "Dog", breed: "German Shepherd" },
          healthStatus: "good",
          vaccinations: { completed: 4, overdue: 0, upcoming: 0 },
          upcomingAppointment: null,
          recentMedicalRecords: [],
        }}
      />
    );

    expect(screen.queryByText(/recent medical records/i)).not.toBeInTheDocument();
  });
});