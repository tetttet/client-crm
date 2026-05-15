import type { ProductCurrency } from "../types";

export const currencyOptions: Array<{
  code: ProductCurrency;
  label: string;
  symbol: string;
}> = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "EUR" },
  { code: "GBP", label: "British Pound", symbol: "GBP" },
  { code: "TRY", label: "Turkish Lira", symbol: "TRY" },
  { code: "KZT", label: "Kazakhstani Tenge", symbol: "KZT" },
  { code: "RUB", label: "Russian Ruble", symbol: "RUB" },
  { code: "AED", label: "UAE Dirham", symbol: "AED" },
  { code: "CNY", label: "Chinese Yuan", symbol: "CNY" },
];

export const presetAttributes = [
  "Color",
  "Size",
  "Material",
  "Gender",
  "Country",
  "Warranty",
  "Model",
  "Collection",
  "Style",
  "Pattern",
  "Season",
  "Fit",
  "Capacity",
  "Volume",
  "Weight",
  "Battery life",
  "Power",
  "Voltage",
  "Memory",
  "Storage",
  "Display size",
  "Compatibility",
  "Package contents",
] as const;
