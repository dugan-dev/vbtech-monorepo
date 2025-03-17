export function formatPhysicianNameNpi(
  firstName: string,
  lastName: string,
  npi: string | undefined | null,
) {
  return `${firstName} ${lastName}${npi ? ` (${npi})` : ""}`;
}
