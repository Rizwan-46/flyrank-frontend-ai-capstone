/**
 * Converts a Zod SafeParse error into a { fieldName: message } map
 * for easy per-field error rendering in forms.
 */
export function zodErrorsToFieldMap(error) {
  const fieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}