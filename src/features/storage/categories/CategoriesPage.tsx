"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { createProductsMock } from "@/components/products/products.mock";
import {
  formatProductCompactNumber,
  formatProductPrice,
} from "@/components/products/product-table.utils";
import { storageRoutes } from "@/features/storage/storage-routes";

const actionButtonSx = {
  borderRadius: 0,
  boxShadow: "none",
  fontWeight: 700,
  minHeight: 38,
  px: 1.75,
  textTransform: "none",
};

type CategorySummary = {
  active: number;
  brands: string[];
  draft: number;
  name: string;
  products: number;
  revenue: number;
  stock: number;
  views: number;
};

function buildCategorySummaries(): CategorySummary[] {
  const products = createProductsMock();
  const summaries = new Map<string, CategorySummary>();

  products.forEach((product) => {
    const summary =
      summaries.get(product.category) ??
      {
        active: 0,
        brands: [],
        draft: 0,
        name: product.category,
        products: 0,
        revenue: 0,
        stock: 0,
        views: 0,
      };

    summary.products += 1;
    summary.stock += product.stock;
    summary.views += product.metrics.views;
    summary.revenue += product.metrics.revenue;

    if (product.status === "active") {
      summary.active += 1;
    }

    if (product.status === "draft") {
      summary.draft += 1;
    }

    if (!summary.brands.includes(product.brand)) {
      summary.brands.push(product.brand);
    }

    summaries.set(product.category, summary);
  });

  return Array.from(summaries.values()).sort((leftCategory, rightCategory) =>
    leftCategory.name.localeCompare(rightCategory.name),
  );
}

function CategoryMetricCard({
  helper,
  label,
  value,
}: Readonly<{
  helper: string;
  label: string;
  value: string;
}>) {
  return (
    <Paper
      sx={{
        background: "#ffffff",
        border: "1px solid #d7dce3",
        borderRadius: 0,
        borderTop: "3px solid #1976d2",
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
          sx={{ color: "#1976d2", fontWeight: 800, letterSpacing: "-0.02em" }}
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

export function CategoriesPage() {
  const categories = buildCategorySummaries();
  const totalProducts = categories.reduce(
    (total, category) => total + category.products,
    0,
  );
  const totalStock = categories.reduce(
    (total, category) => total + category.stock,
    0,
  );
  const totalViews = categories.reduce(
    (total, category) => total + category.views,
    0,
  );
  const topCategory = categories.reduce<CategorySummary | null>(
    (currentTopCategory, category) =>
      !currentTopCategory || category.revenue > currentTopCategory.revenue
        ? category
        : currentTopCategory,
    null,
  );

  return (
    <Box sx={{ bgcolor: "#f5f7fb", pb: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Paper
          sx={{
            background: "#ffffff",
            border: "1px solid #d7dce3",
            borderRadius: 0,
            borderTop: "3px solid #1976d2",
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
                  Product categories
                </Typography>
                <Typography
                  sx={{
                    color: "#202124",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                  variant="h4"
                >
                  Categories from existing products
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ maxWidth: 640 }}
                  variant="body1"
                >
                  Category records are generated from the current catalog, so
                  product creation uses the same controlled set.
                </Typography>
              </Stack>

              <Button
                component={Link}
                disableElevation
                href={storageRoutes.createProduct}
                startIcon={<AddRoundedIcon fontSize="small" />}
                sx={{
                  ...actionButtonSx,
                  bgcolor: "#1976d2",
                  color: "#ffffff",
                  "&:hover": {
                    bgcolor: "#1565c0",
                  },
                }}
                variant="contained"
              >
                Create product
              </Button>
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
              <CategoryMetricCard
                helper="Unique category paths in catalog"
                label="Categories"
                value={String(categories.length)}
              />
              <CategoryMetricCard
                helper="Products grouped under these categories"
                label="Products"
                value={String(totalProducts)}
              />
              <CategoryMetricCard
                helper="Available units across all categories"
                label="Inventory"
                value={formatProductCompactNumber(totalStock)}
              />
              <CategoryMetricCard
                helper={topCategory?.name ?? "No category data"}
                label="Top revenue"
                value={topCategory ? formatProductPrice(topCategory.revenue, "USD") : "$0"}
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
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={1.25}
            sx={{
              alignItems: { xs: "flex-start", lg: "center" },
              borderBottom: "1px solid #d7dce3",
              justifyContent: "space-between",
              px: { xs: 2, md: 2.5 },
              py: { xs: 2, md: 2.5 },
            }}
          >
            <Stack spacing={0.5}>
              <Typography sx={{ color: "#1976d2", fontWeight: 800 }} variant="h6">
                Category table
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Same catalog style as the product list, grouped by category.
              </Typography>
            </Stack>

            <Chip
              icon={<Inventory2RoundedIcon fontSize="small" />}
              label={`${formatProductCompactNumber(totalViews)} views`}
              sx={{
                bgcolor: "#ffffff",
                border: "1px solid #d7dce3",
                borderRadius: 0,
                color: "#425466",
                fontWeight: 700,
              }}
              variant="outlined"
            />
          </Stack>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table
              size="small"
              sx={{
                minWidth: 920,
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
                    "Category",
                    "Products",
                    "Brands",
                    "Inventory",
                    "Revenue",
                    "Status mix",
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
                {categories.map((category) => (
                  <TableRow
                    hover
                    key={category.name}
                    sx={{
                      "&:hover": {
                        bgcolor: "#fbfdff",
                      },
                    }}
                  >
                    <TableCell sx={{ minWidth: 260 }}>
                      <Stack spacing={0.35}>
                        <Typography
                          sx={{ color: "#17324f", fontWeight: 800 }}
                          variant="body2"
                        >
                          {category.name}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          Used by current product records
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography sx={{ color: "#17324f", fontWeight: 800 }}>
                        {category.products}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 220 }}>
                      <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                        {category.brands.map((brand) => (
                          <Chip
                            key={`${category.name}-${brand}`}
                            label={brand}
                            size="small"
                            sx={{
                              bgcolor: "#f1f3f4",
                              border: "1px solid #d7dce3",
                              borderRadius: 0,
                              color: "#425466",
                              fontWeight: 700,
                            }}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {category.stock} pcs
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatProductPrice(category.revenue, "USD")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 180 }}>
                      <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                        <Chip
                          label={`${category.active} active`}
                          size="small"
                          sx={{
                            bgcolor: "#e6f4ea",
                            border: "1px solid #a5d6a7",
                            borderRadius: 0,
                            color: "#137333",
                            fontWeight: 800,
                          }}
                          variant="outlined"
                        />
                        <Chip
                          label={`${category.draft} draft`}
                          size="small"
                          sx={{
                            bgcolor: "#fff8e1",
                            border: "1px solid #ffe082",
                            borderRadius: 0,
                            color: "#8d6e00",
                            fontWeight: 800,
                          }}
                          variant="outlined"
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </Box>
  );
}
