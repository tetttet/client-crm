"use client";

import { useDeferredValue, useEffect, useState, useTransition } from "react";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { ProductDetailsDrawer } from "./ProductDetailsDrawer";
import { exportProductsPdfReport } from "./pdf/export-products-pdf-report";
import {
  DEFAULT_PRODUCT_TABLE_FILTERS,
  filterProducts,
  formatProductCompactNumber,
  formatProductDate,
  formatProductPrice,
  getProductDiscountPercent,
  getProductStatusMeta,
  getProductStockFilterValue,
  getProductStockMeta,
  getProductTableSummary,
  productPriceFilterOptions,
  productSortOptions,
  productStockFilterOptions,
} from "./product-table.utils";
import { createProductsMock } from "./products.mock";
import type {
  ProductItem,
  ProductStatusFilter,
  ProductTableFilters,
} from "./product.types";

const actionButtonSx = {
  borderRadius: 0,
  boxShadow: "none",
  borderColor: "#1976d2",
  color: "#1976d2",
  fontWeight: 700,
  minWidth: 96,
  px: 1.75,
  textTransform: "none",
  "&:hover": {
    borderColor: "#1565c0",
    bgcolor: "rgba(25, 118, 210, 0.05)",
  },
};

const filterFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#ffffff",
    borderRadius: 0,
  },
};

const metricCardPalette = [
  {
    borderColor: "#1976d2",
    surface: "#ffffff",
    valueColor: "#1976d2",
  },
  {
    borderColor: "#2e7d32",
    surface: "#ffffff",
    valueColor: "#2e7d32",
  },
  {
    borderColor: "#c62828",
    surface: "#ffffff",
    valueColor: "#c62828",
  },
  {
    borderColor: "#1565c0",
    surface: "#ffffff",
    valueColor: "#1565c0",
  },
];

type CatalogMetricCardProps = Readonly<{
  helper: string;
  label: string;
  toneIndex: number;
  value: string;
}>;

function CatalogMetricCard({
  helper,
  label,
  toneIndex,
  value,
}: CatalogMetricCardProps) {
  const tone = metricCardPalette[toneIndex % metricCardPalette.length];

  return (
    <Paper
      sx={{
        background: tone.surface,
        border: "1px solid #d7dce3",
        borderRadius: 0,
        borderTop: `3px solid ${tone.borderColor}`,
        boxShadow: "none",
        minWidth: 0,
        p: 2,
      }}
    >
      <Stack spacing={0.5}>
        <Typography color="text.secondary" variant="caption">
          {label}
        </Typography>
        <Typography
          sx={{ color: tone.valueColor, fontWeight: 800, letterSpacing: "-0.02em" }}
          variant="h5"
        >
          {value}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {helper}
        </Typography>
      </Stack>
    </Paper>
  );
}

function ProductTableSkeleton() {
  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          background: "#ffffff",
          border: "1px solid #d7dce3",
          borderTop: "3px solid #1976d2",
          borderRadius: 0,
          p: { xs: 2.5, md: 3 },
        }}
      >
        <Stack spacing={1.5}>
          <Skeleton
            animation="wave"
            height={32}
            sx={{ bgcolor: "#dbe6f3", width: 220 }}
            variant="rectangular"
          />
          <Skeleton
            animation="wave"
            height={20}
            sx={{ bgcolor: "#e5edf7", width: "58%" }}
            variant="rectangular"
          />
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))",
              },
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                animation="wave"
                height={96}
                key={`metric-skeleton-${index + 1}`}
                sx={{ bgcolor: "#edf3fa", borderRadius: 0 }}
                variant="rectangular"
              />
            ))}
          </Box>
        </Stack>
      </Box>

      <Paper
        sx={{
          border: "1px solid #d7dce3",
          borderRadius: 0,
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 1.4fr) repeat(3, minmax(180px, 1fr))",
              },
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                animation="wave"
                height={56}
                key={`toolbar-skeleton-${index + 1}`}
                variant="rectangular"
              />
            ))}
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 1040 }}>
            <TableHead>
              <TableRow>
                {Array.from({ length: 7 }).map((_, index) => (
                  <TableCell key={`head-skeleton-${index + 1}`}>
                    <Skeleton animation="wave" height={16} width={88} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`row-skeleton-${index + 1}`}>
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
                    <TableCell key={`cell-skeleton-${index + 1}-${cellIndex + 1}`}>
                      <Skeleton animation="wave" height={26} variant="rectangular" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}

export default function ProductTable() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filters, setFilters] = useState<ProductTableFilters>(
    DEFAULT_PRODUCT_TABLE_FILTERS,
  );
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setProducts(createProductsMock());
      setIsBootstrapping(false);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  const resolvedFilters: ProductTableFilters = {
    ...filters,
    search: deferredSearch,
  };
  const filteredProducts = filterProducts(products, resolvedFilters);
  const statusCounts = {
    all: products.length,
    active: products.filter((product) => product.status === "active").length,
    draft: products.filter((product) => product.status === "draft").length,
    archived: products.filter((product) => product.status === "archived").length,
  };
  const activeProductCount = statusCounts.active;
  const attentionCount = products.filter((product) => {
    const stockState = getProductStockFilterValue(product);

    return stockState === "low-stock" || stockState === "out-of-stock";
  }).length;
  const totalViews = products.reduce(
    (totalViewsValue, product) => totalViewsValue + product.metrics.views,
    0,
  );
  const totalStock = products.reduce(
    (totalStockValue, product) => totalStockValue + product.stock,
    0,
  );
  const categoryOptions = Array.from(
    new Set(products.map((product) => product.category)),
  ).sort((leftCategory, rightCategory) => leftCategory.localeCompare(rightCategory));
  const brandOptions = Array.from(
    new Set(products.map((product) => product.brand)),
  ).sort((leftBrand, rightBrand) => leftBrand.localeCompare(rightBrand));

  const handleSaveProduct = (updatedProduct: ProductItem) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
    setSelectedProductId(updatedProduct.id);
  };

  const handleFilterChange = <Key extends keyof ProductTableFilters>(
    field: Key,
    value: ProductTableFilters[Key],
  ) => {
    startTransition(() => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        [field]: value,
      }));
    });
  };

  const handleStatusChipChange = (value: ProductStatusFilter) => {
    handleFilterChange("status", value);
  };

  const handleResetFilters = () => {
    startTransition(() => {
      setFilters(DEFAULT_PRODUCT_TABLE_FILTERS);
    });
  };

  const handleExportPdf = async () => {
    if (filteredProducts.length === 0 || isExportingPdf) {
      return;
    }

    setIsExportingPdf(true);

    try {
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });

      await exportProductsPdfReport({
        filters: resolvedFilters,
        products: filteredProducts,
      });
    } catch (error) {
      console.error("Failed to export products PDF report.", error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (isBootstrapping) {
    return <ProductTableSkeleton />;
  }

  return (
    <Box sx={{ bgcolor: "#f5f7fb", pb: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Paper
          sx={{
            background: "#ffffff",
            border: "1px solid #d7dce3",
            borderTop: "3px solid #1976d2",
            borderRadius: 0,
            boxShadow: "none",
            color: "#202124",
            overflow: "hidden",
            p: { xs: 2.5, md: 3 },
          }}
        >
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "flex-start", lg: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={0.75} sx={{ maxWidth: 760 }}>
                <Typography
                  sx={{
                    bgcolor: "#e3f2fd",
                    border: "1px solid #90caf9",
                    borderRadius: 0,
                    color: "#1565c0",
                    display: "inline-flex",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    px: 1.25,
                    py: 0.5,
                    textTransform: "uppercase",
                    width: "fit-content",
                  }}
                >
                  Product catalog
                </Typography>
                <Typography
                  sx={{ color: "#202124", fontWeight: 800, letterSpacing: "-0.03em" }}
                  variant="h4"
                >
                  Compact marketplace table with fast filters
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 640 }} variant="body1">
                  Trendyol-inspired density, but adapted to the project&apos;s blue
                  visual language. Search, filter, inspect, and export the current
                  product slice to PDF in one place.
                </Typography>
              </Stack>

              <Box
                sx={{
                  bgcolor: "#f8fbff",
                  border: "1px solid #d7dce3",
                  borderLeft: "3px solid #1976d2",
                  borderRadius: 0,
                  minWidth: { xs: "100%", sm: 280 },
                  px: 2,
                  py: 1.75,
                }}
              >
                <Stack spacing={0.5}>
                  <Typography color="text.secondary" variant="caption">
                    Current view
                  </Typography>
                  <Typography sx={{ color: "#1976d2", fontWeight: 800 }} variant="h5">
                    {filteredProducts.length} / {products.length}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {getProductTableSummary(resolvedFilters)}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  xl: "repeat(4, minmax(0, 1fr))",
                },
              }}
            >
              <CatalogMetricCard
                helper="Total SKU records in local preview"
                label="Products"
                toneIndex={0}
                value={String(products.length)}
              />
              <CatalogMetricCard
                helper="Currently visible in active status"
                label="Live now"
                toneIndex={1}
                value={String(activeProductCount)}
              />
              <CatalogMetricCard
                helper="Low or empty stock that needs action"
                label="Attention"
                toneIndex={2}
                value={String(attentionCount)}
              />
              <CatalogMetricCard
                helper={`Inventory units: ${formatProductCompactNumber(totalStock)}`}
                label="Catalog views"
                toneIndex={3}
                value={formatProductCompactNumber(totalViews)}
              />
            </Box>
          </Stack>
        </Paper>

        <Paper
          sx={{
            border: "1px solid #d7dce3",
            borderRadius: 0,
            boxShadow: "none",
            overflow: "hidden",
          }}
        >
          {isPending ? (
            <LinearProgress
              sx={{
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#1976d2",
                },
                bgcolor: "#e3f2fd",
              }}
            />
          ) : null}

          <Stack
            spacing={2}
            sx={{
              borderBottom: "1px solid #d7dce3",
              px: { xs: 2, md: 2.5 },
              py: { xs: 2, md: 2.5 },
            }}
          >
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={1.25}
              sx={{
                alignItems: { xs: "stretch", lg: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ color: "#1976d2", fontWeight: 800 }} variant="h6">
                  Products table
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Compact rows, quick catalog filters, and PDF export for the current
                  filtered view.
                </Typography>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  disableElevation
                  onClick={handleResetFilters}
                  startIcon={<RestartAltRoundedIcon fontSize="small" />}
                  sx={actionButtonSx}
                  variant="outlined"
                >
                  Reset filters
                </Button>
                <Button
                  disableElevation
                  disabled={filteredProducts.length === 0 || isExportingPdf}
                  onClick={handleExportPdf}
                  startIcon={
                    isExportingPdf ? (
                      <CircularProgress color="inherit" size={16} thickness={5} />
                    ) : (
                      <PictureAsPdfRoundedIcon fontSize="small" />
                    )
                  }
                  sx={{
                    ...actionButtonSx,
                    bgcolor: "#1976d2",
                    borderColor: "#1976d2",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#1565c0",
                      borderColor: "#1565c0",
                    },
                  }}
                  variant="contained"
                >
                  {isExportingPdf ? "Preparing PDF..." : "Export PDF"}
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {(
                [
                  { label: "All", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Draft", value: "draft" },
                  { label: "Archived", value: "archived" },
                ] as const
              ).map((statusOption) => (
                <Chip
                  clickable
                  key={statusOption.value}
                  label={`${statusOption.label} · ${
                    statusCounts[statusOption.value]
                  }`}
                  onClick={() => handleStatusChipChange(statusOption.value)}
                  sx={{
                    bgcolor:
                      filters.status === statusOption.value ? "#1976d2" : "#ffffff",
                    border: "1px solid",
                    borderColor:
                      filters.status === statusOption.value ? "#1976d2" : "#d7dce3",
                    borderRadius: 0,
                    color:
                      filters.status === statusOption.value ? "#ffffff" : "#425466",
                    fontWeight: 700,
                    height: 34,
                    "& .MuiChip-label": {
                      px: 1.25,
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>

            <Box
              sx={{
                display: "grid",
                gap: 1.25,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(0, 1.45fr) repeat(3, minmax(180px, 1fr))",
                  xl: "minmax(0, 1.45fr) repeat(5, minmax(160px, 1fr))",
                },
              }}
            >
              <TextField
                fullWidth
                label="Search products"
                onChange={(event) =>
                  handleFilterChange("search", event.target.value)
                }
                placeholder="Title, SKU, brand, tag..."
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={filterFieldSx}
                value={filters.search}
              />

              <FormControl fullWidth size="small">
                <InputLabel id="product-category-filter-label">Category</InputLabel>
                <Select
                  label="Category"
                  labelId="product-category-filter-label"
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleFilterChange("category", event.target.value)
                  }
                  sx={filterFieldSx}
                  value={filters.category}
                >
                  <MenuItem value="all">All categories</MenuItem>
                  {categoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="product-brand-filter-label">Brand</InputLabel>
                <Select
                  label="Brand"
                  labelId="product-brand-filter-label"
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleFilterChange("brand", event.target.value)
                  }
                  sx={filterFieldSx}
                  value={filters.brand}
                >
                  <MenuItem value="all">All brands</MenuItem>
                  {brandOptions.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="product-stock-filter-label">Stock</InputLabel>
                <Select
                  label="Stock"
                  labelId="product-stock-filter-label"
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleFilterChange(
                      "stock",
                      event.target.value as ProductTableFilters["stock"],
                    )
                  }
                  sx={filterFieldSx}
                  value={filters.stock}
                >
                  {productStockFilterOptions.map((stockOption) => (
                    <MenuItem key={stockOption.value} value={stockOption.value}>
                      {stockOption.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="product-price-filter-label">Price</InputLabel>
                <Select
                  label="Price"
                  labelId="product-price-filter-label"
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleFilterChange(
                      "price",
                      event.target.value as ProductTableFilters["price"],
                    )
                  }
                  sx={filterFieldSx}
                  value={filters.price}
                >
                  {productPriceFilterOptions.map((priceOption) => (
                    <MenuItem key={priceOption.value} value={priceOption.value}>
                      {priceOption.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="product-sort-filter-label">Sort</InputLabel>
                <Select
                  label="Sort"
                  labelId="product-sort-filter-label"
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleFilterChange(
                      "sortBy",
                      event.target.value as ProductTableFilters["sortBy"],
                    )
                  }
                  sx={filterFieldSx}
                  value={filters.sortBy}
                >
                  {productSortOptions.map((sortOption) => (
                    <MenuItem key={sortOption.value} value={sortOption.value}>
                      {sortOption.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>

          <TableContainer sx={{ maxHeight: 760, overflowX: "auto" }}>
            <Table
              size="small"
              stickyHeader
              sx={{
                minWidth: 1180,
                "& .MuiTableCell-root": {
                  borderColor: "#e8eff7",
                  px: 2,
                  py: 1.4,
                  verticalAlign: "middle",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Performance",
                    "Status",
                    "Dates",
                    "Action",
                  ].map((label) => (
                    <TableCell
                      key={label}
                      sx={{
                        bgcolor: "#f8fbff",
                        color: "#5f6368",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const statusMeta = getProductStatusMeta(product.status);
                    const stockMeta = getProductStockMeta(product);
                    const discountPercent = getProductDiscountPercent(product);

                    return (
                      <TableRow
                        hover
                        key={product.id}
                        sx={{
                          "&:hover": {
                            bgcolor: "#fbfdff",
                          },
                        }}
                      >
                        <TableCell sx={{ minWidth: 290 }}>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <Box
                              alt={product.title}
                              component="img"
                              src={product.images[0]}
                              sx={{
                                bgcolor: "#eef4fb",
                                border: "1px solid #d7dce3",
                                borderRadius: 0,
                                display: "block",
                                flexShrink: 0,
                                height: 56,
                                objectFit: "cover",
                                width: 56,
                              }}
                            />

                            <Stack spacing={0.4} sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  color: "#17324f",
                                  fontWeight: 700,
                                  lineHeight: 1.3,
                                }}
                                variant="body2"
                              >
                                {product.title}
                              </Typography>
                              <Typography color="text.secondary" variant="caption">
                                {product.brand} · {product.sku}
                              </Typography>
                              <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                                {product.tags.slice(0, 2).map((tag) => (
                                  <Box
                                    component="span"
                                    key={`${product.id}-${tag}`}
                                    sx={{
                                      bgcolor: "#f1f3f4",
                                      border: "1px solid #d7dce3",
                                      borderRadius: 0,
                                      color: "#425466",
                                      fontSize: 11,
                                      fontWeight: 700,
                                      px: 1,
                                      py: 0.35,
                                    }}
                                  >
                                    {tag}
                                  </Box>
                                ))}
                              </Stack>
                            </Stack>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ minWidth: 220 }}>
                          <Stack spacing={0.35}>
                            <Typography sx={{ color: "#17324f", fontWeight: 600 }} variant="body2">
                              {product.category}
                            </Typography>
                            <Typography color="text.secondary" variant="caption">
                              {product.attributes.Color ?? product.attributes.Material ?? "Standard configuration"}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ minWidth: 170, whiteSpace: "nowrap" }}>
                          <Stack spacing={0.35}>
                            <Typography sx={{ color: "#17324f", fontWeight: 800 }} variant="body2">
                              {formatProductPrice(product.price, product.currency)}
                            </Typography>
                            {product.compareAtPrice ? (
                              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.75 }}>
                                <Typography
                                  color="text.secondary"
                                  sx={{ textDecoration: "line-through" }}
                                  variant="caption"
                                >
                                  {formatProductPrice(
                                    product.compareAtPrice,
                                    product.currency,
                                  )}
                                </Typography>
                                {discountPercent > 0 ? (
                                  <Box
                                    component="span"
                                    sx={{
                                      bgcolor: "#fbe9e7",
                                      border: "1px solid #ef9a9a",
                                      borderRadius: 0,
                                      color: "#be123c",
                                      fontSize: 11,
                                      fontWeight: 800,
                                      px: 0.85,
                                      py: 0.25,
                                    }}
                                  >
                                    -{discountPercent}%
                                  </Box>
                                ) : null}
                              </Stack>
                            ) : (
                              <Typography color="text.secondary" variant="caption">
                                No compare-at price
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ minWidth: 150 }}>
                          <Stack spacing={0.45}>
                            <Typography sx={{ color: "#17324f", fontWeight: 800 }} variant="body2">
                              {product.stock} pcs
                            </Typography>
                            <Box
                              component="span"
                              sx={{
                                alignSelf: "flex-start",
                                bgcolor: stockMeta.backgroundColor,
                                border: `1px solid ${stockMeta.borderColor}`,
                                borderRadius: 0,
                                color: stockMeta.color,
                                fontSize: 11,
                                fontWeight: 800,
                                px: 1,
                                py: 0.3,
                              }}
                            >
                              {stockMeta.label}
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ minWidth: 180 }}>
                          <Stack spacing={0.45}>
                            <Typography sx={{ color: "#17324f", fontWeight: 700 }} variant="body2">
                              {formatProductCompactNumber(product.metrics.views)} views
                            </Typography>
                            <Typography color="text.secondary" variant="caption">
                              {product.metrics.orders} orders · {product.metrics.rating.toFixed(1)} rating
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ minWidth: 120 }}>
                          <Box
                            component="span"
                            sx={{
                              bgcolor: statusMeta.backgroundColor,
                              border: `1px solid ${statusMeta.borderColor}`,
                              borderRadius: 0,
                              color: statusMeta.color,
                              display: "inline-flex",
                              fontSize: 11,
                              fontWeight: 800,
                              letterSpacing: "0.04em",
                              px: 1.1,
                              py: 0.35,
                              textTransform: "uppercase",
                            }}
                          >
                            {statusMeta.label}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ minWidth: 150, whiteSpace: "nowrap" }}>
                          <Stack spacing={0.35}>
                            <Typography sx={{ color: "#17324f", fontWeight: 700 }} variant="body2">
                              {formatProductDate(product.createdAt)}
                            </Typography>
                            <Typography color="text.secondary" variant="caption">
                              Updated {formatProductDate(product.updatedAt)}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          <Button
                            disableElevation
                            onClick={() => setSelectedProductId(product.id)}
                            size="small"
                            sx={actionButtonSx}
                            variant="outlined"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 5 }}>
                      <Stack spacing={1.25} sx={{ alignItems: "center", textAlign: "center" }}>
                        <Typography sx={{ color: "#17324f", fontWeight: 800 }} variant="h6">
                          No products match these filters
                        </Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: 460 }} variant="body2">
                          Try resetting filters or broadening the search query. The
                          table keeps the current structure ready for larger datasets
                          without loading extra UI noise.
                        </Typography>
                        <Button
                          disableElevation
                          onClick={handleResetFilters}
                          startIcon={<RestartAltRoundedIcon fontSize="small" />}
                          sx={actionButtonSx}
                          variant="outlined"
                        >
                          Clear filters
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      <ProductDetailsDrawer
        onClose={() => setSelectedProductId(null)}
        onSave={handleSaveProduct}
        open={Boolean(selectedProduct)}
        product={selectedProduct}
      />
    </Box>
  );
}
