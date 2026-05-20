"use client";

import { useState, type ChangeEvent } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {
  buildProductAttributesRecord,
  cloneProduct,
  formatProductDate,
  formatProductPrice,
  getProductStatusMeta,
  productStatusOptions,
} from "./product-table.utils";
import type { ProductItem, ProductStatus } from "./product.types";

type ProductDetailsDrawerProps = Readonly<{
  onClose: () => void;
  onSave: (product: ProductItem) => Promise<void> | void;
  open: boolean;
  product: ProductItem | null;
}>;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#ffffff",
    borderRadius: 0,
  },
};

const secondaryButtonSx = {
  borderColor: "#1976d2",
  borderRadius: 0,
  boxShadow: "none",
  color: "#1976d2",
  fontWeight: 600,
  minHeight: 40,
  px: 2,
  textTransform: "none",
  "&:hover": {
    borderColor: "#1565c0",
    bgcolor: "rgba(25, 118, 210, 0.04)",
  },
};

const primaryButtonSx = {
  ...secondaryButtonSx,
  bgcolor: "#1976d2",
  color: "#ffffff",
  "&:hover": {
    bgcolor: "#1565c0",
  },
};

const tagChipSx = {
  borderRadius: 0,
  borderColor: "#90caf9",
  color: "#1565c0",
  fontWeight: 600,
  height: 30,
  "& .MuiChip-label": {
    px: 1.25,
  },
};

function parseTags(value: string) {
  const seen = new Set<string>();

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      const normalizedTag = tag.toLowerCase();

      if (seen.has(normalizedTag)) {
        return false;
      }

      seen.add(normalizedTag);
      return true;
    });
}

function ProductDetailItem({
  label,
  value,
}: Readonly<{ label: string; value: React.ReactNode }>) {
  return (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        px: 1.5,
        py: 1.35,
      }}
    >
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>
        {typeof value === "string" ? (
          <Typography sx={{ fontWeight: 600, wordBreak: "break-word" }} variant="body2">
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
}

export function ProductDetailsDrawer({
  onClose,
  onSave,
  open,
  product,
}: ProductDetailsDrawerProps) {
  const [draftProduct, setDraftProduct] = useState<ProductItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleFieldChange = <Key extends keyof ProductItem>(
    field: Key,
    value: ProductItem[Key],
  ) => {
    setDraftProduct((currentProduct) =>
      currentProduct
        ? {
            ...currentProduct,
            [field]: value,
          }
        : currentProduct,
    );
  };

  const handleNumberChange =
    (field: "discount" | "price" | "stock") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number(event.target.value);

      handleFieldChange(field, Number.isNaN(nextValue) ? 0 : nextValue);
    };

  const handleStatusChange = (event: SelectChangeEvent<ProductStatus>) => {
    handleFieldChange("status", event.target.value as ProductStatus);
  };

  const handleImageChange = (index: number, value: string) => {
    setDraftProduct((currentProduct) => {
      if (!currentProduct) {
        return currentProduct;
      }

      const nextImages = currentProduct.images.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      );

      return {
        ...currentProduct,
        images: nextImages,
      };
    });
  };

  const handleCharacteristicChange = (
    characteristicId: string,
    field: "label" | "value",
    value: string,
  ) => {
    setDraftProduct((currentProduct) => {
      if (!currentProduct) {
        return currentProduct;
      }

      const nextCharacteristics = currentProduct.characteristics.map(
        (characteristic) =>
          characteristic.id === characteristicId
            ? {
                ...characteristic,
                [field]: value,
              }
            : characteristic,
      );

      return {
        ...currentProduct,
        attributes: buildProductAttributesRecord(nextCharacteristics),
        characteristics: nextCharacteristics,
      };
    });
  };

  const handleSeoFieldChange = (
    field: "description" | "title",
    value: string,
  ) => {
    setDraftProduct((currentProduct) =>
      currentProduct
        ? {
            ...currentProduct,
            seo: {
              ...currentProduct.seo,
              [field]: value,
            },
          }
        : currentProduct,
    );
  };

  const handleTagsChange = (value: string) => {
    setDraftProduct((currentProduct) =>
      currentProduct
        ? {
            ...currentProduct,
            tags: parseTags(value),
          }
        : currentProduct,
    );
  };

  const handleCancel = () => {
    if (isSaving) {
      return;
    }

    setDraftProduct(null);
    setIsEditing(false);
    setSaveError(null);
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    handleCancel();
    onClose();
  };

  const handleSave = async () => {
    if (!draftProduct || isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSave(cloneProduct(draftProduct));
      setDraftProduct(null);
      setIsEditing(false);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to save product.",
      );
      return;
    } finally {
      setIsSaving(false);
    }
  };

  if (!product) {
    return null;
  }

  const currentProduct = isEditing && draftProduct ? draftProduct : product;
  const statusMeta = getProductStatusMeta(currentProduct.status);

  return (
    <Drawer
      anchor="right"
      onClose={handleClose}
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 520 },
          maxWidth: "100%",
          bgcolor: "#ffffff",
          borderLeft: "1px solid #e5e7eb",
          borderRadius: 0,
          boxShadow: "none",
        },
      }}
    >
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            borderBottom: "1px solid #e5e7eb",
            px: { xs: 2, sm: 3 },
            py: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
          >
            <Box>
              <Typography color="text.secondary" variant="subtitle2">
                Product details
              </Typography>
              <Typography sx={{ mt: 0.5, fontWeight: 700 }} variant="h6">
                {isEditing ? "Edit product" : "Product profile"}
              </Typography>
            </Box>

            <IconButton
              aria-label="Close product details"
              disabled={isSaving}
              onClick={handleClose}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 0,
                color: "text.secondary",
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 2, sm: 3 },
            py: 3,
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                Images
              </Typography>

              {currentProduct.images.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.25,
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  }}
                >
                  {currentProduct.images.map((image, index) => (
                    <Stack
                      key={`${currentProduct.id}-image-${index + 1}`}
                      spacing={1}
                      sx={{
                        border: "1px solid #e5e7eb",
                        p: 1,
                      }}
                    >
                      <Box
                        alt={`${currentProduct.title} image ${index + 1}`}
                        component="img"
                        src={image}
                        sx={{
                          aspectRatio: "1 / 1",
                          display: "block",
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />

                      {isEditing ? (
                        <TextField
                          fullWidth
                          label={`Image URL ${index + 1}`}
                          onChange={(event) =>
                            handleImageChange(index, event.target.value)
                          }
                          size="small"
                          sx={fieldSx}
                          value={image}
                        />
                      ) : null}
                    </Stack>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    border: "1px dashed #d7dce3",
                    px: 1.5,
                    py: 2,
                  }}
                >
                  <Typography color="text.secondary" variant="body2">
                    No image URLs are stored for this product yet.
                  </Typography>
                </Box>
              )}
            </Stack>

            {isEditing ? (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Product name"
                  onChange={(event) =>
                    handleFieldChange("title", event.target.value)
                  }
                  sx={fieldSx}
                  value={currentProduct.title}
                />

                <TextField
                  fullWidth
                  label="Description"
                  minRows={4}
                  multiline
                  onChange={(event) =>
                    handleFieldChange("description", event.target.value)
                  }
                  sx={fieldSx}
                  value={currentProduct.description}
                />

                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  }}
                >
                  <TextField
                    fullWidth
                    label="SKU"
                    onChange={(event) =>
                      handleFieldChange("sku", event.target.value)
                    }
                    sx={fieldSx}
                    value={currentProduct.sku}
                  />
                  <TextField
                    fullWidth
                    label="Category"
                    onChange={(event) =>
                      handleFieldChange("category", event.target.value)
                    }
                    sx={fieldSx}
                    value={currentProduct.category}
                  />
                  <TextField
                    fullWidth
                    label="Brand"
                    onChange={(event) =>
                      handleFieldChange("brand", event.target.value)
                    }
                    sx={fieldSx}
                    value={currentProduct.brand}
                  />
                  <TextField
                    fullWidth
                    label="Price"
                    onChange={handleNumberChange("price")}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: "0.01",
                      },
                    }}
                    sx={fieldSx}
                    type="number"
                    value={currentProduct.price}
                  />
                  <TextField
                    fullWidth
                    label="Discount"
                    onChange={handleNumberChange("discount")}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: "0.01",
                      },
                    }}
                    sx={fieldSx}
                    type="number"
                    value={currentProduct.discount}
                  />
                  <TextField
                    fullWidth
                    label="Stock"
                    onChange={handleNumberChange("stock")}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: "1",
                      },
                    }}
                    sx={fieldSx}
                    type="number"
                    value={currentProduct.stock}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="product-details-status-label">Status</InputLabel>
                    <Select
                      label="Status"
                      labelId="product-details-status-label"
                      onChange={handleStatusChange}
                      sx={{
                        bgcolor: "#ffffff",
                        borderRadius: 0,
                      }}
                      value={currentProduct.status}
                    >
                      {productStatusOptions.map((statusOption) => (
                        <MenuItem
                          key={statusOption.value}
                          value={statusOption.value}
                        >
                          {statusOption.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Created date"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    sx={fieldSx}
                    type="date"
                    value={currentProduct.createdAt.slice(0, 10)}
                  />
                  <TextField
                    fullWidth
                    label="Tags"
                    onChange={(event) => handleTagsChange(event.target.value)}
                    placeholder="flagship, apple, smartphone"
                    sx={fieldSx}
                    value={currentProduct.tags.join(", ")}
                  />
                </Box>

                <Divider />

                <Stack spacing={1.25}>
                  <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                    SEO
                  </Typography>
                  <TextField
                    fullWidth
                    label="SEO title"
                    onChange={(event) =>
                      handleSeoFieldChange("title", event.target.value)
                    }
                    sx={fieldSx}
                    value={currentProduct.seo.title}
                  />
                  <TextField
                    fullWidth
                    label="SEO description"
                    minRows={3}
                    multiline
                    onChange={(event) =>
                      handleSeoFieldChange("description", event.target.value)
                    }
                    sx={fieldSx}
                    value={currentProduct.seo.description}
                  />
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.25}
                    sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
                  >
                    <Typography sx={{ fontWeight: 700 }} variant="h5">
                      {currentProduct.title}
                    </Typography>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: statusMeta.backgroundColor,
                        border: `1px solid ${statusMeta.borderColor}`,
                        color: statusMeta.color,
                        display: "inline-flex",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        px: 1,
                        py: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {statusMeta.label}
                    </Box>
                  </Stack>

                  <Typography color="text.secondary" variant="body2">
                    {currentProduct.description}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gap: 1.25,
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  }}
                >
                  <ProductDetailItem label="SKU" value={currentProduct.sku} />
                  <ProductDetailItem label="Brand" value={currentProduct.brand} />
                  <ProductDetailItem
                    label="Category"
                    value={currentProduct.category}
                  />
                  <ProductDetailItem label="Slug" value={currentProduct.slug} />
                  <ProductDetailItem
                    label="Price"
                    value={
                      currentProduct.compareAtPrice
                        ? `${formatProductPrice(
                            currentProduct.price,
                            currentProduct.currency,
                          )} • was ${formatProductPrice(
                            currentProduct.compareAtPrice,
                            currentProduct.currency,
                          )}`
                        : formatProductPrice(
                            currentProduct.price,
                            currentProduct.currency,
                          )
                    }
                  />
                  <ProductDetailItem
                    label="Discount"
                    value={
                      currentProduct.discount > 0
                        ? `-${formatProductPrice(
                            currentProduct.discount,
                            currentProduct.currency,
                          )}`
                        : "No discount"
                    }
                  />
                  <ProductDetailItem
                    label="Stock"
                    value={`${currentProduct.stock} pcs`}
                  />
                  <ProductDetailItem
                    label="Created"
                    value={formatProductDate(currentProduct.createdAt)}
                  />
                  <ProductDetailItem
                    label="Updated"
                    value={formatProductDate(currentProduct.updatedAt)}
                  />
                </Box>
              </Stack>
            )}

            <Divider />

            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                Tags
              </Typography>

              {currentProduct.tags.length > 0 ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  {currentProduct.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={tagChipSx}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              ) : (
                <ProductDetailItem
                  label="Tags"
                  value="No tags added for this product."
                />
              )}
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                SEO
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gap: 1.25,
                  gridTemplateColumns: "1fr",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#f8fbff",
                    border: "1px solid #dbeafe",
                    px: 1.5,
                    py: 1.5,
                  }}
                >
                  <Typography color="#1565c0" sx={{ fontWeight: 700 }} variant="caption">
                    SEO title
                  </Typography>
                  <Typography sx={{ mt: 0.75, fontWeight: 600 }} variant="body2">
                    {currentProduct.seo.title}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    bgcolor: "#f8fbff",
                    border: "1px solid #dbeafe",
                    px: 1.5,
                    py: 1.5,
                  }}
                >
                  <Typography color="#1565c0" sx={{ fontWeight: 700 }} variant="caption">
                    SEO description
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                    {currentProduct.seo.description}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 700 }} variant="subtitle2">
                Specifications
              </Typography>

              {isEditing ? (
                currentProduct.characteristics.length > 0 ? (
                  <Stack spacing={1.25}>
                    {currentProduct.characteristics.map((characteristic) => (
                      <Box
                        key={characteristic.id}
                        sx={{
                          display: "grid",
                          gap: 1.25,
                          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Attribute"
                          onChange={(event) =>
                            handleCharacteristicChange(
                              characteristic.id,
                              "label",
                              event.target.value,
                            )
                          }
                          size="small"
                          sx={fieldSx}
                          value={characteristic.label}
                        />
                        <TextField
                          fullWidth
                          label="Value"
                          onChange={(event) =>
                            handleCharacteristicChange(
                              characteristic.id,
                              "value",
                              event.target.value,
                            )
                          }
                          size="small"
                          sx={fieldSx}
                          value={characteristic.value}
                        />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <ProductDetailItem
                    label="Specifications"
                    value="No specifications stored for this product."
                  />
                )
              ) : (
                currentProduct.characteristics.length > 0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.25,
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                    }}
                  >
                    {currentProduct.characteristics.map((characteristic) => (
                      <ProductDetailItem
                        key={characteristic.id}
                        label={characteristic.label}
                        value={characteristic.value}
                      />
                    ))}
                  </Box>
                ) : (
                  <ProductDetailItem
                    label="Specifications"
                    value="No specifications stored for this product."
                  />
                )
              )}
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            borderTop: "1px solid #e5e7eb",
            px: { xs: 2, sm: 3 },
            py: 2,
          }}
        >
          {saveError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          ) : null}

          <Stack direction="row" spacing={1.25} sx={{ justifyContent: "flex-end" }}>
            {isEditing ? (
              <>
                <Button
                  disableElevation
                  disabled={isSaving}
                  onClick={handleCancel}
                  sx={secondaryButtonSx}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  disableElevation
                  disabled={isSaving}
                  onClick={handleSave}
                  sx={primaryButtonSx}
                  variant="contained"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button
                disableElevation
                onClick={() => {
                  setDraftProduct(cloneProduct(product));
                  setIsEditing(true);
                  setSaveError(null);
                }}
                sx={primaryButtonSx}
                variant="contained"
              >
                Edit
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
}
