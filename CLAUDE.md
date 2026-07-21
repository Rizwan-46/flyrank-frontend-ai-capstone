## Project Structure

```
/
├── README.md          # Project documentation
├── LICENSE            # MIT License
├── .gitignore         # Git ignored files
├── CLAUDE.md          # AI instructions and coding conventions
```

## AI Assistant Instructions

When making code changes:
- Follow React best practices.
- Use functional components and hooks.
- Keep code clean and reusable.
- Explain important changes before applying them.
## Engineering Standards & Form Rules

1. **Form State & Validation:** All forms must use `react-hook-form` paired with `zod` schemas (`@hookform/resolvers/zod`). Never use manual `useState` object mapping or uncontrolled inputs for form fields.
2. **Strict Accessibility Standards:** Every form input must have a programmatically associated `<label>` using `htmlFor`. Validation error messages must be bound to the input and include `role="alert"`.
3. **UI Guardrails & Button States:** Submit buttons must be dynamically disabled when a form is actively submitting (`isSubmitting`) or when no changes have been made (`!isDirty`).