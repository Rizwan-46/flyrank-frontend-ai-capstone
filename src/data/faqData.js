export const homeFaqs = [
  {
    question: "Is this a real veterinary service?",
    answer:
      "No. PetCare App is a demo/portfolio project. It uses locally stored demo data and does not connect to any real clinic, vet, or backend service.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "All data — pets, medical records, vaccinations, and appointments — is stored locally in your browser using localStorage. Nothing is sent to a server.",
  },
  {
    question: "How are vaccination statuses calculated?",
    answer:
      "Statuses (Upcoming, Due Today, Overdue, Completed) are calculated automatically from the vaccination's next due date compared to today's date — never manually set.",
  },
  {
    question: "Will I get real notifications or emails?",
    answer:
      "No. Reminders are shown directly in the app UI (like the dashboard), not through email, SMS, or push notifications.",
  },
  {
    question: "Can I use demo login credentials?",
    answer:
      "Yes. You can sign up with your own dummy account, or use one of the pre-loaded demo accounts to explore the app immediately.",
  },
  {
    question: "Will my data persist after refreshing the page?",
    answer:
      "Yes. Since data is saved to localStorage, your pets, records, and appointments remain after a refresh — until you clear your browser storage.",
  },
];