import type { CellInput, RowInput, Styles } from "jspdf-autotable";

import {
  formatProductCompactNumber,
  formatProductDate,
  formatProductPrice,
  getProductDiscountPercent,
  getProductSortLabel,
  getProductStatusMeta,
  getProductStockMeta,
  getProductTableSummaryItems,
} from "../product-table.utils";
import type { ProductItem, ProductTableFilters } from "../product.types";

import {
  PRODUCT_PDF_COLORS,
  PRODUCT_PDF_COLUMNS,
  PRODUCT_PDF_PLACEHOLDER,
} from "./product-pdf.config";

export type ProductPdfReportMetadata = Readonly<{
  appliedFiltersLabel: string;
  generatedAtLabel: string;
  productCountLabel: string;
  sortOrderLabel: string;
}>;

const integerFormatter = new Intl.NumberFormat("en-US");
const reportTimestampFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatOptionalText(value: string | null | undefined) {
  if (!value) {
    return PRODUCT_PDF_PLACEHOLDER;
  }

  const trimmedValue = value.trim();

  return trimmedValue || PRODUCT_PDF_PLACEHOLDER;
}

function formatList(values: string[]) {
  const normalizedValues = values
    .map((value) => value.trim())
    .filter(Boolean);

  return normalizedValues.length > 0
    ? normalizedValues.join(", ")
    : PRODUCT_PDF_PLACEHOLDER;
}

function formatAttributes(product: ProductItem) {
  const characteristicSummary = product.characteristics
    .map((characteristic) => {
      const label = characteristic.label.trim();
      const value = characteristic.value.trim();

      if (!label || !value) {
        return null;
      }

      return `${label}: ${value}`;
    })
    .filter((value): value is string => value !== null);

  if (characteristicSummary.length > 0) {
    return characteristicSummary.join("; ");
  }

  const attributeEntries = Object.entries(product.attributes)
    .map(([key, value]) => {
      const normalizedKey = key.trim();
      const normalizedValue = value.trim();

      if (!normalizedKey || !normalizedValue) {
        return null;
      }

      return `${normalizedKey}: ${normalizedValue}`;
    })
    .filter((value): value is string => value !== null);

  return attributeEntries.length > 0
    ? attributeEntries.join("; ")
    : PRODUCT_PDF_PLACEHOLDER;
}

function formatDimensions(product: ProductItem) {
  const dimensionParts = [
    product.dimensions.width.trim()
      ? `W ${product.dimensions.width.trim()}`
      : null,
    product.dimensions.height.trim()
      ? `H ${product.dimensions.height.trim()}`
      : null,
    product.dimensions.length.trim()
      ? `L ${product.dimensions.length.trim()}`
      : null,
    product.dimensions.weight.trim()
      ? `Weight ${product.dimensions.weight.trim()}`
      : null,
  ].filter((value): value is string => value !== null);

  return dimensionParts.length > 0
    ? dimensionParts.join(" | ")
    : PRODUCT_PDF_PLACEHOLDER;
}

function formatPricingDetails(product: ProductItem) {
  const compareAtPrice = product.compareAtPrice
    ? formatProductPrice(product.compareAtPrice, product.currency)
    : PRODUCT_PDF_PLACEHOLDER;
  const discountAmount =
    product.discount > 0
      ? formatProductPrice(product.discount, product.currency)
      : PRODUCT_PDF_PLACEHOLDER;
  const discountPercent = getProductDiscountPercent(product);
  const discountLabel =
    discountPercent > 0 ? `${discountPercent}%` : PRODUCT_PDF_PLACEHOLDER;

  return `Compare at ${compareAtPrice} | Discount ${discountLabel} | Amount ${discountAmount} | Currency ${product.currency}`;
}

function formatLifecycleCell(product: ProductItem) {
  return [
    getProductStatusMeta(product.status).label,
    `Created ${formatProductDate(product.createdAt)}`,
    `Updated ${formatProductDate(product.updatedAt)}`,
  ].join("\n");
}

function formatPerformanceCell(product: ProductItem) {
  return [
    `${formatProductCompactNumber(product.metrics.views)} views`,
    `${integerFormatter.format(product.metrics.orders)} orders`,
    `${product.metrics.rating.toFixed(1)} rating`,
  ].join("\n");
}

function formatInventoryCell(product: ProductItem) {
  return [
    `${integerFormatter.format(product.stock)} pcs`,
    `Status: ${getProductStockMeta(product).label}`,
    `Weight: ${formatOptionalText(product.dimensions.weight)}`,
  ].join("\n");
}

function createBodyCell(
  content: string,
  styles?: Partial<Styles>,
): CellInput {
  return {
    content,
    styles,
  };
}

function buildProductMainRow(product: ProductItem, index: number): RowInput {
  const discountPercent = getProductDiscountPercent(product);

  return [
    createBodyCell(
      [`#${String(index + 1).padStart(2, "0")} ${formatOptionalText(product.title)}`, `SKU: ${formatOptionalText(product.sku)}`].join(
        "\n",
      ),
      { textColor: PRODUCT_PDF_COLORS.primaryText },
    ),
    createBodyCell(
      [
        formatOptionalText(product.category),
        `Brand: ${formatOptionalText(product.brand)}`,
      ].join("\n"),
    ),
    createBodyCell(
      [
        formatProductPrice(product.price, product.currency),
        `Compare at: ${
          product.compareAtPrice
            ? formatProductPrice(product.compareAtPrice, product.currency)
            : PRODUCT_PDF_PLACEHOLDER
        }`,
        `Discount: ${
          discountPercent > 0
            ? `${discountPercent}%`
            : PRODUCT_PDF_PLACEHOLDER
        }`,
      ].join("\n"),
    ),
    createBodyCell(formatInventoryCell(product)),
    createBodyCell(formatPerformanceCell(product)),
    createBodyCell(formatLifecycleCell(product)),
  ];
}

function buildProductDetailsRow(product: ProductItem): RowInput {
  const revenueLabel = formatProductPrice(product.metrics.revenue, product.currency);
  const mediaCountLabel = `${integerFormatter.format(product.images.length)} image(s)`;

  return [
    {
      colSpan: PRODUCT_PDF_COLUMNS.length,
      content: [
        `Description: ${formatOptionalText(product.description)}`,
        `Tags: ${formatList(product.tags)}`,
        `Attributes: ${formatAttributes(product)}`,
        `Dimensions: ${formatDimensions(product)}`,
        `Pricing detail: ${formatPricingDetails(product)}`,
        `SEO title: ${formatOptionalText(product.seo.title)}`,
        `SEO description: ${formatOptionalText(product.seo.description)}`,
        `Identifiers: ID ${formatOptionalText(product.id)} | Slug ${formatOptionalText(
          product.slug,
        )} | Media ${mediaCountLabel} | Revenue ${revenueLabel}`,
      ].join("\n"),
      styles: {
        cellPadding: {
          bottom: 8,
          left: 8,
          right: 8,
          top: 7,
        },
        fillColor: PRODUCT_PDF_COLORS.detailSurface,
        fontSize: 8.25,
        lineColor: PRODUCT_PDF_COLORS.border,
        lineWidth: 0.5,
        textColor: PRODUCT_PDF_COLORS.mutedText,
      },
    },
  ];
}

export function buildProductPdfRows(products: ProductItem[]) {
  return products.flatMap<RowInput>((product, index) => [
    buildProductMainRow(product, index),
    buildProductDetailsRow(product),
  ]);
}

export function buildProductPdfReportMetadata(
  products: ProductItem[],
  filters: ProductTableFilters,
  generatedAt: Date,
): ProductPdfReportMetadata {
  const filterSummaryItems = getProductTableSummaryItems(filters);

  return {
    appliedFiltersLabel:
      filterSummaryItems.length > 0
        ? filterSummaryItems.join(" • ")
        : "All products",
    generatedAtLabel: reportTimestampFormatter.format(generatedAt),
    productCountLabel: integerFormatter.format(products.length),
    sortOrderLabel: getProductSortLabel(filters.sortBy),
  };
}

export function buildProductPdfFileName(generatedAt: Date) {
  const year = generatedAt.getFullYear();
  const month = String(generatedAt.getMonth() + 1).padStart(2, "0");
  const day = String(generatedAt.getDate()).padStart(2, "0");
  const hours = String(generatedAt.getHours()).padStart(2, "0");
  const minutes = String(generatedAt.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}-${hours}${minutes}`;
}
