import type { jsPDF } from "jspdf";
import type { UserOptions } from "jspdf-autotable";

import type { ProductItem, ProductTableFilters } from "../product.types";

import {
  PRODUCT_PDF_COLORS,
  PRODUCT_PDF_COLUMNS,
  PRODUCT_PDF_COLUMN_STYLES,
  PRODUCT_PDF_LAYOUT,
  PRODUCT_PDF_REPORT_INFO,
} from "./product-pdf.config";
import {
  buildProductPdfFileName,
  buildProductPdfReportMetadata,
  buildProductPdfRows,
} from "./product-pdf.formatters";

type ProductPdfExportOptions = Readonly<{
  filters: ProductTableFilters;
  products: ProductItem[];
}>;

type ProductPdfHeaderLayout = Readonly<{
  contentWidth: number;
  filterLines: string[];
  headerHeight: number;
  tableStartY: number;
}>;

function getPageWidth(doc: jsPDF) {
  return doc.internal.pageSize.getWidth();
}

function getPageHeight(doc: jsPDF) {
  return doc.internal.pageSize.getHeight();
}

function setPdfTextColor(doc: jsPDF, color: [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setPdfDrawColor(doc: jsPDF, color: [number, number, number]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function setPdfFillColor(doc: jsPDF, color: [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function buildHeaderLayout(
  doc: jsPDF,
  appliedFiltersLabel: string,
): ProductPdfHeaderLayout {
  const contentWidth =
    getPageWidth(doc) - PRODUCT_PDF_LAYOUT.margin.left - PRODUCT_PDF_LAYOUT.margin.right;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.25);

  const filterLines = doc.splitTextToSize(
    appliedFiltersLabel,
    contentWidth - 28,
  ) as string[];
  const headerHeight = 108 + filterLines.length * 10;

  return {
    contentWidth,
    filterLines,
    headerHeight,
    tableStartY:
      PRODUCT_PDF_LAYOUT.firstPageHeaderTop +
      headerHeight +
      PRODUCT_PDF_LAYOUT.firstPageTableGap,
  };
}

function drawFirstPageHeader(
  doc: jsPDF,
  metadata: ReturnType<typeof buildProductPdfReportMetadata>,
  layout: ProductPdfHeaderLayout,
) {
  const x = PRODUCT_PDF_LAYOUT.margin.left;
  const y = PRODUCT_PDF_LAYOUT.firstPageHeaderTop;
  const statsBoxWidth = 112;
  const statsBoxHeight = 56;
  const statsBoxX = x + layout.contentWidth - statsBoxWidth - 14;
  const statsBoxY = y + PRODUCT_PDF_LAYOUT.firstPageTopPadding;
  const dividerY = y + 78;
  const filtersTitleY = dividerY + 18;
  const filtersTextY = filtersTitleY + 12;

  setPdfFillColor(doc, PRODUCT_PDF_COLORS.paper);
  doc.rect(x, y, layout.contentWidth, layout.headerHeight, "F");
  setPdfDrawColor(doc, PRODUCT_PDF_COLORS.border);
  doc.setLineWidth(1);
  doc.rect(x, y, layout.contentWidth, layout.headerHeight, "S");

  setPdfFillColor(doc, PRODUCT_PDF_COLORS.accent);
  doc.rect(x, y, layout.contentWidth, 5, "F");

  setPdfFillColor(doc, PRODUCT_PDF_COLORS.accentSurface);
  doc.rect(statsBoxX, statsBoxY, statsBoxWidth, statsBoxHeight, "F");
  setPdfDrawColor(doc, PRODUCT_PDF_COLORS.border);
  doc.rect(statsBoxX, statsBoxY, statsBoxWidth, statsBoxHeight, "S");

  setPdfTextColor(doc, PRODUCT_PDF_COLORS.primaryText);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(PRODUCT_PDF_REPORT_INFO.title, x + 14, y + 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.mutedText);
  doc.text(PRODUCT_PDF_REPORT_INFO.subtitle, x + 14, y + 47, {
    maxWidth: layout.contentWidth - statsBoxWidth - 46,
  });
  doc.text(`Generated: ${metadata.generatedAtLabel}`, x + 14, y + 64);
  doc.text(`Sorted by: ${metadata.sortOrderLabel}`, x + 14, y + 76);
  doc.text(`System: ${PRODUCT_PDF_REPORT_INFO.systemName}`, x + 176, y + 76);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.mutedText);
  doc.text("Matching products", statsBoxX + statsBoxWidth / 2, statsBoxY + 14, {
    align: "center",
  });

  doc.setFontSize(20);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.accent);
  doc.text(metadata.productCountLabel, statsBoxX + statsBoxWidth / 2, statsBoxY + 35, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.mutedText);
  doc.text("filtered records", statsBoxX + statsBoxWidth / 2, statsBoxY + 49, {
    align: "center",
  });

  setPdfDrawColor(doc, PRODUCT_PDF_COLORS.border);
  doc.line(x + 14, dividerY, x + layout.contentWidth - 14, dividerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.primaryText);
  doc.text("Applied filters", x + 14, filtersTitleY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.25);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.mutedText);
  doc.text(layout.filterLines, x + 14, filtersTextY, {
    maxWidth: layout.contentWidth - 28,
  });
}

function drawCompactPageHeader(
  doc: jsPDF,
  metadata: ReturnType<typeof buildProductPdfReportMetadata>,
) {
  const x = PRODUCT_PDF_LAYOUT.margin.left;
  const y = PRODUCT_PDF_LAYOUT.compactHeaderY;
  const contentWidth =
    getPageWidth(doc) - PRODUCT_PDF_LAYOUT.margin.left - PRODUCT_PDF_LAYOUT.margin.right;

  setPdfFillColor(doc, PRODUCT_PDF_COLORS.accentSurface);
  doc.rect(x, y, contentWidth, PRODUCT_PDF_LAYOUT.compactHeaderHeight, "F");
  setPdfDrawColor(doc, PRODUCT_PDF_COLORS.border);
  doc.rect(x, y, contentWidth, PRODUCT_PDF_LAYOUT.compactHeaderHeight, "S");

  setPdfFillColor(doc, PRODUCT_PDF_COLORS.accent);
  doc.rect(x, y, 6, PRODUCT_PDF_LAYOUT.compactHeaderHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.primaryText);
  doc.text(PRODUCT_PDF_REPORT_INFO.title, x + 16, y + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.mutedText);
  doc.text(
    `${metadata.generatedAtLabel} • ${metadata.productCountLabel} products`,
    x + contentWidth - 12,
    y + 22,
    { align: "right" },
  );
}

function drawFooter(
  doc: jsPDF,
  metadata: ReturnType<typeof buildProductPdfReportMetadata>,
  pageNumber: number,
  totalPages: number,
) {
  const pageHeight = getPageHeight(doc);
  const x = PRODUCT_PDF_LAYOUT.margin.left;
  const rightX = getPageWidth(doc) - PRODUCT_PDF_LAYOUT.margin.right;
  const lineY = pageHeight - PRODUCT_PDF_LAYOUT.footerLineOffset;
  const textY = pageHeight - PRODUCT_PDF_LAYOUT.footerTextOffset;

  setPdfDrawColor(doc, PRODUCT_PDF_COLORS.border);
  doc.line(x, lineY, rightX, lineY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setPdfTextColor(doc, PRODUCT_PDF_COLORS.mutedText);
  doc.text(PRODUCT_PDF_REPORT_INFO.systemName, x, textY);
  doc.text(metadata.generatedAtLabel, (x + rightX) / 2, textY, {
    align: "center",
  });
  doc.text(`Page ${pageNumber} of ${totalPages}`, rightX, textY, {
    align: "right",
  });
}

function buildAutoTableOptions(
  doc: jsPDF,
  products: ProductItem[],
  metadata: ReturnType<typeof buildProductPdfReportMetadata>,
  layout: ProductPdfHeaderLayout,
): UserOptions {
  const tableWidth =
    getPageWidth(doc) - PRODUCT_PDF_LAYOUT.margin.left - PRODUCT_PDF_LAYOUT.margin.right;

  return {
    body: buildProductPdfRows(products),
    bodyStyles: {
      fontSize: 9,
      minCellHeight: 34,
      textColor: PRODUCT_PDF_COLORS.primaryText,
      valign: "top",
    },
    columnStyles: PRODUCT_PDF_COLUMN_STYLES,
    head: [PRODUCT_PDF_COLUMNS.map((column) => column.header)],
    headStyles: {
      cellPadding: {
        bottom: 7,
        left: 8,
        right: 8,
        top: 7,
      },
      fillColor: PRODUCT_PDF_COLORS.accentSurface,
      fontSize: 8.5,
      fontStyle: "bold",
      lineColor: PRODUCT_PDF_COLORS.border,
      lineWidth: 0.75,
      textColor: PRODUCT_PDF_COLORS.mutedText,
    },
    margin: PRODUCT_PDF_LAYOUT.margin,
    pageBreak: "auto",
    rowPageBreak: "auto",
    showHead: "everyPage",
    startY: layout.tableStartY,
    styles: {
      cellPadding: {
        bottom: 8,
        left: 8,
        right: 8,
        top: 8,
      },
      cellWidth: "wrap",
      font: "helvetica",
      lineColor: PRODUCT_PDF_COLORS.border,
      lineWidth: 0.5,
      overflow: "linebreak",
      textColor: PRODUCT_PDF_COLORS.primaryText,
      valign: "top",
    },
    tableLineColor: PRODUCT_PDF_COLORS.border,
    tableLineWidth: 0.75,
    tableWidth,
    theme: "grid",
    willDrawPage: ({ pageNumber }) => {
      if (pageNumber === 1) {
        drawFirstPageHeader(doc, metadata, layout);
        return;
      }

      drawCompactPageHeader(doc, metadata);
    },
  };
}

export async function exportProductsPdfReport({
  filters,
  products,
}: ProductPdfExportOptions) {
  if (typeof window === "undefined" || products.length === 0) {
    return false;
  }

  const generatedAt = new Date();
  const metadata = buildProductPdfReportMetadata(products, filters, generatedAt);
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default;
  const doc = new jsPDF({
    format: PRODUCT_PDF_LAYOUT.format,
    orientation: PRODUCT_PDF_LAYOUT.orientation,
    unit: PRODUCT_PDF_LAYOUT.unit,
  });
  const headerLayout = buildHeaderLayout(doc, metadata.appliedFiltersLabel);

  autoTable(doc, buildAutoTableOptions(doc, products, metadata, headerLayout));

  const totalPages = doc.getNumberOfPages();

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    doc.setPage(pageNumber);
    drawFooter(doc, metadata, pageNumber, totalPages);
  }

  await doc.save(
    `${PRODUCT_PDF_REPORT_INFO.filePrefix}-${buildProductPdfFileName(generatedAt)}.pdf`,
    { returnPromise: true },
  );

  return true;
}
