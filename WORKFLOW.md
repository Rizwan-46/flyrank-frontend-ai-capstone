# AI Pair-Programming Workflow & Comparison Analysis

## Executive Summary
This exercise compared two distinct AI prompting strategies to build a profile settings form using React, Vite, and Tailwind CSS v4. Round 1 utilized a single, vague prompt with zero context, while Round 2 utilized a structured prompt specifying constraints, schema validation, and accessibility standards.

## 1. Correctness & State Management (Specific Diffs)
- **Round 1 (Vague):** The AI relied on manual `useState` object mapping for form fields and wrote custom, verbose inline validation (`if (!formData.fullName)...`). This approach caused unnecessary component re-renders on every keystroke and lacked robust schema enforcement.
- **Round 2 (Precise):** By explicitly mandating `@hookform/resolvers/zod` and `zod`, the resulting diff eliminated manual state boilerplate entirely. The form delegates field tracking to `useForm()` and enforces strict validation rules cleanly outside the render cycle.

## 2. Accessibility & UI Guardrails
- **Round 1 Mistakes Caught:** The AI failed to include `htmlFor` attributes on form labels, omitted `aria-invalid` bindings on inputs, and lacked `role="alert"` on error messages. Additionally, the inputs lacked explicit background and text color classes (`bg-white dark:bg-slate-900`), which caused the input fields to render invisibly (black text on a black background) when viewed in dark mode.
- **Round 2 Improvements:** The AI correctly implemented ARIA attributes, linked labels programmatically, and added visual guardrails: a dynamic character counter (`{bioValue.length}/160`), a success banner with `role="status"`, and a submit button that dynamically disables when the form is unchanged (`!isDirty`) or submitting (`isSubmitting`).

## 3. Time to Production & Review Effort
- **Round 1:** While generating the code took only 10 seconds, the review and manual remediation effort was high. Fixing dark mode contrast bugs, adding missing accessibility attributes, and replacing clunky state logic would take 20–30 minutes of manual refactoring.
- **Round 2:** Drafting the detailed prompt took approximately 3 minutes upfront. However, end-to-end development time was significantly faster because the output required zero refactoring to meet production-grade accessibility and validation standards.