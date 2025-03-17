export function formatMarketingAndRefName(
  marketingName: string,
  referenceName?: string | null,
) {
  if (referenceName) {
    return `${marketingName} (${referenceName})`;
  }
  return marketingName;
}
