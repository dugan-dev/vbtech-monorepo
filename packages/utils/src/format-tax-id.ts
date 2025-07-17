export const formatTaxId = (value: string) => {
  if (!value) return value;
  const taxId = value.replace(/[^\d]/g, "");
  const taxIdLength = taxId.length;
  if (taxIdLength < 3) return taxId;

  // Format as XX-XXXXXXX
  return `${taxId.slice(0, 2)}-${taxId.slice(2, 9)}`;
};
