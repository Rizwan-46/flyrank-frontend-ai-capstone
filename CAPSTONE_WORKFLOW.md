## Prompt 1 — Project Foundation

Using the Pet Care Management Website specification I provided, start with PHASE 1 ONLY.

Build the project foundation using:

* Next.js
* JavaScript
* Tailwind CSS
* shadcn/ui
* Zod
* Zustand
* next-themes (for dark mode support)

Do not implement the actual pet management functionality yet.

Create a clean, scalable folder structure for the project.

Set up:

* App Router
* Public layout
* Protected application layout
* Components structure
* Data structure
* Zustand stores structure
* Zod schemas structure
* Utility structure
* shadcn/ui setup
* **Dark mode foundation** — ThemeProvider (using next-themes), ThemeToggle component, and Tailwind dark-mode configuration (class-based strategy)

Create the initial hardcoded dummy-data files with realistic but fictional data for:

* Users
* Pets
* Medical records
* Vaccinations
* Appointments

The dummy data should have relationships between users and their pets and between pets and their medical records, vaccinations, and appointments.

Do NOT implement:

* Settings
* User profile
* Medication tracking
* Documents
* Notifications
* Backend
* Database
* Real authentication
* Any feature outside the master specification.

At the end, show me:

1. Final folder structure
2. Files created
3. Dependencies used (including next-themes)
4. What is intentionally NOT implemented yet

Do not move to Phase 2.

---

## Prompt 2 — Authentication

Implement PHASE 2 ONLY: Dummy Authentication.

Use the existing project structure and do not redesign it.

Implement:

* Signup
* Login
* Logout
* Dummy user authentication
* Zustand auth store
* localStorage persistence
* Protected dashboard routes
* Redirect unauthenticated users to /login
* Redirect authenticated users appropriately after login

Use Zod for:

* Signup validation
* Login validation

Handle:

* Empty fields
* Invalid email
* Invalid password
* Password confirmation mismatch
* Existing email
* Wrong credentials
* Logout
* Refreshing the browser while logged in
* Directly visiting a protected route while logged out

Use the existing hardcoded users as initial demo accounts.

Do NOT implement:

* Real authentication
* Backend
* Database
* OAuth
* Google login
* Email verification
* Password reset
* Password change
* 2FA
* User profile
* Settings

Do not implement Dashboard features yet except whatever minimal protected layout is required to verify authentication.

At the end, explain:

* Files changed
* Authentication flow
* How localStorage is being used
* How protected routes work

Do not move to Phase 3.

---

## Prompt 3 — Public Pages

Implement PHASE 3 ONLY: Public Website Pages.

Create polished responsive pages for:

* Home / Landing Page
* About Us
* Contact Us
* Privacy Policy
* Terms & Conditions

Use Tailwind CSS and shadcn/ui where appropriate.

Home page should contain:

* Hero section
* Short explanation of the Pet Care platform
* Key features from the approved project scope
* Clear Login and Signup CTAs
* Professional pet-care visual style
* Dark mode toggle in the navigation

About Us should explain the fictional Pet Care platform and its purpose.

Contact Us should include:

* Name
* Email
* Subject
* Message
* Submit button

Validate the contact form with Zod.

Privacy Policy and Terms & Conditions can use fictional/demo content appropriate for a portfolio project.

Do NOT implement:

* Real email sending
* Backend
* CMS
* User profile
* Settings
* Newsletter
* Blog
* Social media system
* Any feature outside the approved scope.

Make all pages responsive.

Do not modify the existing authentication logic unless required for navigation.

Do not implement the dashboard yet.

---

## Prompt 4 — Dashboard

Implement PHASE 4 ONLY: Dashboard.

Create the authenticated Dashboard using the existing dummy data and Zustand stores.

The dashboard MUST contain:

1. Total Pets
2. Upcoming Vaccinations
3. Overdue Vaccinations
4. Upcoming Appointments
5. Recent Medical Records
6. Useful quick actions

Vaccination status must be calculated from dates.

Use these statuses:

* Upcoming
* Due Today
* Overdue
* Completed

Show overdue vaccinations clearly, including the number of days overdue.

Example:

"Rabies — Overdue by 12 days"

Show empty states where appropriate.

Examples:

* No pets
* No upcoming vaccinations
* No overdue vaccinations
* No upcoming appointments
* No recent medical records

Use shadcn/ui and Tailwind CSS.

The dashboard must be responsive and support dark mode.

Include a dashboard navigation sidebar or top navigation with links to:

* Dashboard
* Pets
* Medical Records (standalone page)
* Vaccinations (standalone page)
* Appointments
* Theme toggle

Do NOT implement:

* Pet CRUD
* Medical record CRUD
* Vaccination CRUD
* Appointment CRUD

Those will be implemented in later phases.

Do not add charts, advanced analytics, settings, profile, notifications, or any unapproved feature.

---

## Prompt 5 — Pet Management

Implement PHASE 5 ONLY: Pet Management.

Implement:

* Pet list
* Pet search
* Add pet
* Edit pet
* Delete pet
* Pet profile navigation

Use Zustand for pet state.

Use localStorage for persistence.

Use Zod for pet form validation.

Pet fields:

* Name
* Species
* Breed
* Gender
* Date of birth
* Weight
* Allergies
* Microchip ID
* Notes

Required fields should be clearly defined and validated.

Handle:

* Empty pet list
* Search with no results
* Case-insensitive search
* Partial search
* Invalid birth date
* Invalid weight
* Missing required fields
* Delete confirmation
* Deleting a pet with associated records

When deleting a pet, clearly warn the user that associated medical records, vaccinations, and appointments will also be removed from the application's dummy/local data.

Keep the UI responsive and support dark mode.

Do NOT implement medical records, vaccinations, or appointments CRUD yet. Only provide the navigation/placeholders necessary to reach the pet profile.

Do NOT add filters, sorting, profile settings, or unrelated features unless already required by the existing specification.

---

## Prompt 6 — Medical History

Implement PHASE 6 ONLY: Medical History.

For each pet profile, implement:

* Medical history list
* Medical timeline
* Add medical record
* Edit medical record
* Delete medical record
* Empty state

Medical record fields:

* Date
* Visit/reason
* Diagnosis
* Treatment
* Veterinarian
* Notes

Use:

* Zod for validation
* Zustand for state
* localStorage for persistence
* shadcn/ui components
* Tailwind CSS

Handle:

* No medical records
* Invalid date
* Missing required fields
* Very long notes
* Delete confirmation
* Multiple records on the same date
* Records displayed in chronological order

Additionally, create a **standalone `/dashboard/medical-records` page** that displays all medical records across all pets in a unified list/timeline view. This page should:

* Show all medical records from all pets
* Display which pet each record belongs to
* Allow navigation to the specific pet profile
* Support filtering by pet (optional)
* Be responsive and support dark mode

Do not implement:

* Medical document uploads
* Medication tracking
* AI diagnosis
* Vet chat
* Advanced analytics

Do not modify unrelated modules.

---

## Prompt 7 — Vaccinations + Reminders

Implement PHASE 7 ONLY: Vaccinations and Vaccination Reminders.

Implement:

* Vaccination list
* Vaccination history
* Add vaccination
* Edit vaccination
* Delete vaccination
* Mark vaccination as completed
* Next due date
* Vaccination status
* Vaccination reminders

Vaccination fields:

* Vaccination name
* Administered date
* Next due date
* Veterinarian
* Notes

Use Zod validation.

Use Zustand state.

Persist changes using localStorage.

IMPORTANT:

Do NOT store "overdue" as a permanent boolean.

Calculate vaccination status dynamically from the next due date.

Statuses:

UPCOMING
DUE TODAY
OVERDUE
COMPLETED

Rules:

* nextDueDate > today → UPCOMING
* nextDueDate = today → DUE TODAY
* nextDueDate < today → OVERDUE
* completed vaccination → COMPLETED

For overdue vaccinations, calculate and display:

"Overdue by X days"

For upcoming vaccinations, display:

"Due in X days"

Vaccination reminders must appear on the Dashboard.

Clicking a reminder should navigate to the appropriate pet/vaccination information.

When the user marks an overdue vaccination as completed, require the user to provide the administered date and next due date.

Additionally, create a **standalone `/dashboard/vaccinations` page** that displays all vaccinations across all pets in a unified list view. This page should:

* Show all vaccinations from all pets
* Display which pet each vaccination belongs to
* Show vaccination status (upcoming, due today, overdue, completed)
* Allow navigation to the specific pet profile
* Support filtering by pet and status (optional)
* Be responsive and support dark mode

Do NOT implement:

* Push notifications
* Email notifications
* SMS
* Browser notifications
* Medication tracking
* Vet communication

Do not add any feature outside the approved scope.

---

## Prompt 8 — Appointments

Implement PHASE 8 ONLY: Appointments.

Implement:

* Appointment list
* Add appointment
* Edit appointment
* Cancel appointment
* Upcoming appointments
* Past appointments

Appointment fields:

* Pet
* Date
* Time
* Reason
* Veterinarian
* Notes

Use Zod validation.

Use Zustand for state.

Persist appointments using localStorage.

Rules:

* New appointments cannot be created in the past.
* Upcoming appointments and past appointments should be visually separated.
* Cancelled appointments should have a clear status.
* Show an appropriate empty state when there are no appointments.

Handle:

* Missing required fields
* Invalid date
* Past date
* Missing pet
* Long notes
* Delete/cancel confirmation

Update the Dashboard's upcoming appointments section to use the actual appointment store.

Create a **standalone `/dashboard/appointments` page** that displays all appointments across all pets. This page should:

* Show all appointments from all pets
* Display which pet each appointment belongs to
* Separate upcoming and past appointments
* Show appointment status (upcoming, past, cancelled)
* Allow navigation to the specific pet profile
* Be responsive and support dark mode

Do not implement any unrelated features.

---

## Prompt 9 — Final Edge-Case & Polish Pass

Perform PHASE 9 ONLY: Final QA, edge cases, and responsive polish.

Do NOT add new features.

Review the entire existing Pet Care application against the original master specification.

Test and fix these edge cases:

1. Wrong login credentials
2. Access dashboard without login
3. User with zero pets
4. User with many pets
5. Missing pet information
6. Pet with no medical history
7. Vaccination due today
8. Overdue vaccination
9. Search with no results
10. Delete pet with associated records

Also verify:

* Signup validation
* Login validation
* Contact form validation
* Medical record validation
* Vaccination validation
* Appointment validation
* Invalid dates
* Empty states
* Delete confirmations
* localStorage persistence
* Refresh persistence
* Responsive layout
* Mobile navigation
* Long text
* Dialog overflow
* Form overflow
* Dashboard cards on mobile
* **Dark mode across all pages and components**
* **Theme toggle functionality**
* **Standalone medical records page**
* **Standalone vaccinations page**
* **Standalone appointments page**

Check for:

* Duplicated logic
* Broken imports
* Unnecessary dependencies
* Unused components
* Incorrect Zustand state updates
* localStorage hydration problems
* Date calculation bugs
* Incorrect vaccination status
* Broken navigation
* Protected route issues
* Dark mode styling inconsistencies
* Theme toggle accessibility

Do NOT introduce:

* Settings
* User profile
* Notifications
* Backend
* Database
* New features

At the end, provide a concise QA report listing:

* Issues found
* Issues fixed
* Remaining issues, if any
* Confirmation that no out-of-scope features were added
