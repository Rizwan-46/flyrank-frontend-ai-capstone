export function allergiesToString(allergies) {
  if (!allergies || allergies.length === 0) return "";
  return allergies.join(", ");
}

export function stringToAllergies(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}