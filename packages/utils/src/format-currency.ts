export type FormatCurrencyProps = {
  value: string | number;
  currency?: string;
  locale?: string;
  options?: Intl.NumberFormatOptions;
};

export function formatCurrency({
  value,
  currency = "USD",
  locale = "en-US",
  options,
}: FormatCurrencyProps) {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return value.toString();
  }

  const defaultOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formatOptions = { ...defaultOptions, ...options };

  return new Intl.NumberFormat(locale, formatOptions).format(numericValue);
}
