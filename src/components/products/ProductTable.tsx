"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import type { ReactNode } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

type ProductTableProps = {
  products: ReadonlyArray<any>;
  fillHeight?: boolean;
  onViewProduct?: (product: any) => void;
  viewportHeight?: number;
};

type ProductDetailItemProps = Readonly<{
  iconBgColor?: string;
  iconColor?: string;
  icon: ReactNode;
  label: string;
  valueColor?: string;
  value: string;
}>;

function getProductAvatar(product: any) {
  const label =
    product.generalInformation ?? product.media ?? product.mainPhoto ?? "P";

  return String(label).trim().slice(0, 2).toUpperCase();
}

function ProductDetailItem({
  iconBgColor = "rgba(26, 115, 232, 0.08)",
  iconColor = "primary.main",
  icon,
  label,
  valueColor = "text.primary",
  value,
}: ProductDetailItemProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: "auto minmax(0, 1fr)",
        alignItems: "start",
        border: 1,
        borderColor: "divider",
        px: 1.75,
        py: 1.5,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: iconBgColor,
          color: iconColor,
        }}
      >
        {icon}
      </Box>

      <Stack spacing={0.35} sx={{ minWidth: 0 }}>
        <Typography color="text.secondary" variant="caption">
          {label}
        </Typography>
        <Typography
          sx={{ color: valueColor, fontWeight: 600, wordBreak: "break-word" }}
          variant="body2"
        >
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}

function ProductTable({
  products,
  fillHeight = true,
  onViewProduct,
  viewportHeight,
}: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    onViewProduct?.(product);
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          height: fillHeight ? "100%" : "auto",
          minHeight: 0,
          flexDirection: "column",
          border: 1,
          borderColor: "white",
          borderRadius: 0,
          gap: 2.5,
          px: { xs: 2.5, md: 3 },
          py: { xs: 2.5, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography color="text.secondary" variant="subtitle2">
              Product dashboard
            </Typography>
            <Typography sx={{ mt: 0.75, fontWeight: 600 }} variant="h5">
              Product management
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
              Manage product details, media, pricing and shipping
            </Typography>
          </Box>

          <Chip
            label={`${products.length} products`}
            size="small"
            sx={{
              borderRadius: 999,
              bgcolor: "primary.light",
              color: "primary.main",
              fontWeight: 700,
            }}
          />
        </Box>

        <Box
          sx={{
            flex: fillHeight ? 1 : "0 0 auto",
            minHeight: 0,
            maxHeight: viewportHeight,
            overflowX: "auto",
            overflowY: "auto",
          }}
        >
          <Table
            size="small"
            sx={{
              minWidth: 1120,
              "& .MuiTableCell-root": {
                py: 1.5,
              },
            }}
          >
            <TableHead
              sx={{
                bgcolor: "rgba(26, 115, 232, 0.04)",
              }}
            >
              <TableRow>
                <TableCell>General information</TableCell>
                <TableCell>Media</TableCell>
                <TableCell>Main photo</TableCell>
                <TableCell>Gallery</TableCell>
                <TableCell>Attributes</TableCell>
                <TableCell>SEO</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Pricing</TableCell>
                <TableCell>Inventory &amp; shipping</TableCell>
                <TableCell>Organization</TableCell>
                <TableCell align="right">View</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  hover
                  key={product?.id ?? index}
                  sx={{
                    "&:last-child .MuiTableCell-root": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell>
                    <Tooltip title="Открыть полный продукт">
                      <IconButton
                        aria-label={`Открыть продукт ${product.generalInformation}`}
                        onClick={() => handleViewProduct(product)}
                        sx={{
                          borderRadius: 999,
                          p: 0,
                          transition: "transform 160ms ease, box-shadow 160ms ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: 3,
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            fontSize: 13,
                            fontWeight: 700,
                            height: 36,
                            width: 36,
                          }}
                        >
                          {getProductAvatar(product)}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    {product.media}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {product.mainPhoto}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                  >
                    {product.gallery}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {product.attributes}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      label={product.seo}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 999, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {product.status}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      color={product.pricing ? "success" : "default"}
                      label={product.pricing}
                      size="small"
                      sx={{ borderRadius: 999, fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>{product.inventoryShipping}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.organization}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        bgcolor: "rgba(96, 165, 250, 0.14)",
                        color: "#1d4ed8",
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Button
                      endIcon={<VisibilityRoundedIcon fontSize="small" />}
                      onClick={() => handleViewProduct(product)}
                      size="small"
                      variant="text"
                    >
                      Просмотреть
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <Drawer
        anchor="right"
        onClose={() => setSelectedProduct(null)}
        open={Boolean(selectedProduct)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 430 },
            maxWidth: "100%",
          },
        }}
      >
        {selectedProduct ? (
          <Stack sx={{ height: "100%" }}>
            <Box
              sx={{
                px: { xs: 2.5, sm: 3 },
                py: { xs: 2.5, sm: 3 },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "space-between" }}
              >
                <Box>
                  <Typography color="text.secondary" variant="subtitle2">
                    Full profile
                  </Typography>
                  <Typography sx={{ mt: 0.75, fontWeight: 700 }} variant="h5">
                    Product
                  </Typography>
                </Box>

                <IconButton
                  aria-label="Закрыть профиль"
                  onClick={() => setSelectedProduct(null)}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Stack>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 72,
                      height: 72,
                      fontSize: 26,
                      fontWeight: 800,
                    }}
                  >
                    {getProductAvatar(selectedProduct)}
                  </Avatar>

                  <Stack spacing={1} sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }} variant="h5">
                      {selectedProduct.generalInformation}
                    </Typography>

                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        label={selectedProduct.seo}
                        size="small"
                        sx={{ borderRadius: 999, fontWeight: 700 }}
                      />
                      <Chip
                        icon={<FiberManualRecordRoundedIcon />}
                        label={selectedProduct.status}
                        size="small"
                        sx={{
                          borderRadius: 999,
                          bgcolor:
                            selectedProduct.status === "Active"
                              ? "rgba(34, 197, 94, 0.14)"
                              : "rgba(148, 163, 184, 0.18)",
                          color:
                            selectedProduct.status === "Active"
                              ? "#15803d"
                              : "#475569",
                          fontWeight: 700,
                        }}
                      />
                    </Stack>

                    <Typography color="text.secondary" variant="body2">
                      Media: {selectedProduct.media}
                    </Typography>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gap: 1.25,
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(26, 115, 232, 0.06)",
                      px: 1.75,
                      py: 1.5,
                    }}
                  >
                    <Typography color="text.secondary" variant="caption">
                      Pricing
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }} variant="h6">
                      {selectedProduct.pricing}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      bgcolor: "rgba(96, 165, 250, 0.14)",
                      px: 1.75,
                      py: 1.5,
                    }}
                  >
                    <Typography color="text.secondary" variant="caption">
                      Organization
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }} variant="h6">
                      {selectedProduct.organization}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Divider />

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: { xs: 2.5, sm: 3 },
                py: { xs: 2.5, sm: 3 },
              }}
            >
              <Stack spacing={2.5}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
                    Product information
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
                    All product details in one place.
                  </Typography>
                </Box>

                <Stack spacing={1.25}>
                  <ProductDetailItem
                    icon={<CategoryRoundedIcon fontSize="small" />}
                    label="General information"
                    value={selectedProduct.generalInformation}
                  />
                  <ProductDetailItem
                    icon={<ImageRoundedIcon fontSize="small" />}
                    label="Media"
                    value={selectedProduct.media}
                  />
                  <ProductDetailItem
                    icon={<ImageRoundedIcon fontSize="small" />}
                    label="Main photo"
                    value={selectedProduct.mainPhoto}
                  />
                  <ProductDetailItem
                    icon={<CollectionsRoundedIcon fontSize="small" />}
                    label="Gallery"
                    value={selectedProduct.gallery}
                  />
                  <ProductDetailItem
                    icon={<Inventory2RoundedIcon fontSize="small" />}
                    label="Attributes"
                    value={selectedProduct.attributes}
                  />
                  <ProductDetailItem
                    icon={<SellRoundedIcon fontSize="small" />}
                    label="SEO"
                    value={selectedProduct.seo}
                  />
                  <ProductDetailItem
                    icon={<FiberManualRecordRoundedIcon fontSize="small" />}
                    iconBgColor={
                      selectedProduct.status === "Active"
                        ? "rgba(34, 197, 94, 0.14)"
                        : "rgba(148, 163, 184, 0.18)"
                    }
                    iconColor={
                      selectedProduct.status === "Active" ? "#15803d" : "#475569"
                    }
                    label="Status"
                    valueColor={
                      selectedProduct.status === "Active" ? "#15803d" : "#475569"
                    }
                    value={selectedProduct.status}
                  />
                  <ProductDetailItem
                    icon={<SellRoundedIcon fontSize="small" />}
                    label="Pricing"
                    value={selectedProduct.pricing}
                  />
                  <ProductDetailItem
                    icon={<LocalShippingRoundedIcon fontSize="small" />}
                    label="Inventory & shipping"
                    value={String(selectedProduct.inventoryShipping)}
                  />
                  <ProductDetailItem
                    icon={<CategoryRoundedIcon fontSize="small" />}
                    label="Organization"
                    value={selectedProduct.organization}
                  />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        ) : null}
      </Drawer>
    </>
  );
}

export default ProductTable;
