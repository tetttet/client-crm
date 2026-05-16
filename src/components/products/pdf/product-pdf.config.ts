import type { HAlignType, Styles } from "jspdf-autotable";

export type RgbColor = [number, number, number];

export type ProductPdfColumnKey =
  | "product"
  | "catalog"
  | "pricing"
  | "inventory"
  | "performance"
  | "lifecycle";

export type ProductPdfColumn = Readonly<{
  header: string;
  key: ProductPdfColumnKey;
  textAlign?: HAlignType;
  width: number;
}>;

export const PRODUCT_PDF_PLACEHOLDER = "—";

export const PRODUCT_PDF_REPORT_INFO = {
  filePrefix: "product-catalog-report",
  subtitle: "Filtered catalog snapshot prepared for print, review, and audit.",
  systemName: "Client CRM",
  title: "Product Catalog Report",
} as const;

export const PRODUCT_PDF_LAYOUT = {
  compactHeaderHeight: 34,
  compactHeaderY: 24,
  firstPageHeaderTop: 28,
  firstPageTableGap: 18,
  footerLineOffset: 40,
  footerTextOffset: 24,
  firstPageTopPadding: 16,
  format: "a4",
  margin: {
    bottom: 54,
    left: 36,
    right: 36,
    top: 72,
  },
  orientation: "portrait",
  unit: "pt",
} as const;

export const PRODUCT_PDF_COLORS: Record<
  | "accent"
  | "accentSurface"
  | "border"
  | "detailSurface"
  | "mutedText"
  | "paper"
  | "primaryText",
  RgbColor
> = {
  accent: [25, 118, 210],
  accentSurface: [248, 251, 255],
  border: [215, 220, 227],
  detailSurface: [249, 251, 253],
  mutedText: [95, 99, 104],
  paper: [255, 255, 255],
  primaryText: [23, 50, 79],
};

export const PRODUCT_PDF_COLUMNS: readonly ProductPdfColumn[] = [
  { header: "Product", key: "product", width: 142 },
  { header: "Catalog", key: "catalog", width: 92 },
  { header: "Pricing", key: "pricing", width: 86 },
  { header: "Inventory", key: "inventory", width: 60 },
  { header: "Performance", key: "performance", width: 70 },
  { header: "Lifecycle", key: "lifecycle", width: 73 },
] as const;

export const PRODUCT_PDF_COLUMN_STYLES: Record<number, Partial<Styles>> =
  PRODUCT_PDF_COLUMNS.reduce<Record<number, Partial<Styles>>>(
    (styles, column, index) => {
      styles[index] = {
        cellWidth: column.width,
        halign: column.textAlign ?? "left",
      };

      return styles;
    },
    {},
  );
