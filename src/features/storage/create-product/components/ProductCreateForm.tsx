"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { currencyOptions } from "../lib/product-options";
import { createProductSlug } from "../lib/slug";
import { buttonSx, chipSx, fieldSx, sectionCardSx } from "../lib/styles";
import type {
  ProductAttribute,
  ProductCurrency,
  ProductFormValues,
  ProductImagePreview,
  ProductPayload,
  ProductStatus,
} from "../types";
import { ProductAttributesEditor } from "./ProductAttributesEditor";
import { ProductInventorySection } from "./ProductInventorySection";
import { ProductMediaUpload } from "./ProductMediaUpload";
import { ProductSeoSection } from "./ProductSeoSection";

function createInitialFormValues(): ProductFormValues {
  return {
    title: "",
    description: "",
    currency: "USD",
    price: "",
    compareAtPrice: "",
    sku: "",
    stock: "",
    category: "",
    status: "draft",
    brand: "",
    weight: "",
    width: "",
    height: "",
    length: "",
    seoTitle: "",
    seoDescription: "",
    tags: [],
    attributes: [],
    mainImage: null,
    galleryImages: [],
  };
}

const statusOptions: Array<{
  description: string;
  label: string;
  value: ProductStatus;
}> = [
  {
    value: "draft",
    label: "Draft",
    description: "Keep the product hidden while content is being prepared.",
  },
  {
    value: "active",
    label: "Active",
    description: "Make the product ready for storefront or sales channels.",
  },
  {
    value: "archived",
    label: "Archived",
    description: "Preserve the record without keeping it available for sale.",
  },
];

let localIdCounter = 0;

function createLocalId(prefix: string) {
  localIdCounter += 1;

  return `${prefix}-${localIdCounter}`;
}

function mergeTags(existingTags: string[], rawInput: string) {
  const nextTags = [...existingTags];

  rawInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .forEach((tag) => {
      const alreadyExists = nextTags.some(
        (existingTag) => existingTag.toLowerCase() === tag.toLowerCase(),
      );

      if (!alreadyExists) {
        nextTags.push(tag);
      }
    });

  return nextTags;
}

function createEmptyAttribute(): ProductAttribute {
  return {
    id: createLocalId("attribute"),
    key: "",
    value: "",
  };
}

export function ProductCreateForm() {
  const [values, setValues] = useState<ProductFormValues>(() =>
    createInitialFormValues(),
  );
  const [tagInput, setTagInput] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const previewUrlsRef = useRef<string[]>([]);
  const generatedSlug = createProductSlug(values.title);

  useEffect(() => {
    const previewUrls = previewUrlsRef;

    return () => {
      previewUrls.current.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  const handleValueChange =
    (field: keyof ProductFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }));
    };

  const handleStatusChange = (event: SelectChangeEvent<ProductStatus>) => {
    setValues((currentValues) => ({
      ...currentValues,
      status: event.target.value as ProductStatus,
    }));
  };

  const handleCurrencyChange = (event: SelectChangeEvent<ProductCurrency>) => {
    setValues((currentValues) => ({
      ...currentValues,
      currency: event.target.value as ProductCurrency,
    }));
  };

  const revokePreviewUrl = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    previewUrlsRef.current = previewUrlsRef.current.filter(
      (currentPreviewUrl) => currentPreviewUrl !== previewUrl,
    );
  };

  const handleAddTag = () => {
    const nextTags = mergeTags(values.tags, tagInput);

    setValues((currentValues) => ({
      ...currentValues,
      tags: nextTags,
    }));
    setTagInput("");
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();
    handleAddTag();
  };

  const createImagePreview = (file: File): ProductImagePreview => {
    const previewUrl = URL.createObjectURL(file);

    previewUrlsRef.current.push(previewUrl);

    return {
      id: createLocalId("image"),
      file,
      previewUrl,
    };
  };

  const revokeFormImages = (formValues: ProductFormValues) => {
    if (formValues.mainImage) {
      revokePreviewUrl(formValues.mainImage.previewUrl);
    }

    formValues.galleryImages.forEach((image) => {
      revokePreviewUrl(image.previewUrl);
    });
  };

  const resetForm = () => {
    revokeFormImages(values);
    setValues(createInitialFormValues());
    setTagInput("");
    setIsSnackbarOpen(false);
  };

  const handleMainImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextImage = createImagePreview(file);

    setValues((currentValues) => {
      if (currentValues.mainImage) {
        revokePreviewUrl(currentValues.mainImage.previewUrl);
      }

      return {
        ...currentValues,
        mainImage: nextImage,
      };
    });

    event.target.value = "";
  };

  const handleRemoveMainImage = () => {
    setValues((currentValues) => {
      if (currentValues.mainImage) {
        revokePreviewUrl(currentValues.mainImage.previewUrl);
      }

      return {
        ...currentValues,
        mainImage: null,
      };
    });
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setValues((currentValues) => ({
      ...currentValues,
      galleryImages: [
        ...currentValues.galleryImages,
        ...files.map((file) => createImagePreview(file)),
      ],
    }));

    event.target.value = "";
  };

  const handleRemoveGalleryImage = (imageId: string) => {
    setValues((currentValues) => {
      const imageToRemove = currentValues.galleryImages.find(
        (image) => image.id === imageId,
      );

      if (imageToRemove) {
        revokePreviewUrl(imageToRemove.previewUrl);
      }

      return {
        ...currentValues,
        galleryImages: currentValues.galleryImages.filter(
          (image) => image.id !== imageId,
        ),
      };
    });
  };

  const handleAddAttribute = () => {
    setValues((currentValues) => ({
      ...currentValues,
      attributes: [...currentValues.attributes, createEmptyAttribute()],
    }));
  };

  const handleAddPresetAttribute = (key: string) => {
    setValues((currentValues) => {
      const alreadyExists = currentValues.attributes.some(
        (attribute) => attribute.key.trim().toLowerCase() === key.toLowerCase(),
      );

      if (alreadyExists) {
        return currentValues;
      }

      return {
        ...currentValues,
        attributes: [
          ...currentValues.attributes,
          {
            id: createLocalId("attribute"),
            key,
            value: "",
          },
        ],
      };
    });
  };

  const handleAttributeChange = (
    attributeId: string,
    field: "key" | "value",
    value: string,
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      attributes: currentValues.attributes.map((attribute) =>
        attribute.id === attributeId
          ? {
              ...attribute,
              [field]: value,
            }
          : attribute,
      ),
    }));
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      attributes: currentValues.attributes.filter(
        (attribute) => attribute.id !== attributeId,
      ),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedTags = mergeTags(values.tags, tagInput);
    const productPayload: ProductPayload = {
      title: values.title.trim(),
      description: values.description.trim(),
      slug: generatedSlug,
      currency: values.currency,
      price: Number(values.price),
      compareAtPrice:
        values.compareAtPrice.trim() === ""
          ? null
          : Number(values.compareAtPrice),
      sku: values.sku.trim(),
      stock: Number(values.stock),
      category: values.category.trim(),
      status: values.status,
      brand: values.brand.trim(),
      tags: preparedTags,
      dimensions: {
        weight: values.weight.trim(),
        width: values.width.trim(),
        height: values.height.trim(),
        length: values.length.trim(),
      },
      seo: {
        title: values.seoTitle.trim(),
        description: values.seoDescription.trim(),
      },
      images: {
        mainImage: values.mainImage?.file ?? null,
        gallery: values.galleryImages.map((image) => image.file),
      },
      attributes: values.attributes.reduce<Record<string, string>>(
        (result, attribute) => {
          const key = attribute.key.trim();

          if (!key) {
            return result;
          }

          result[key] = attribute.value.trim();
          return result;
        },
        {},
      ),
    };

    console.log("Created product:", productPayload);
    setValues((currentValues) => ({
      ...currentValues,
      tags: preparedTags,
    }));
    setTagInput("");
    setIsSnackbarOpen(true);
  };

  const activeStatus =
    statusOptions.find((statusOption) => statusOption.value === values.status) ??
    statusOptions[0];

  return (
    <Box sx={{ bgcolor: "#f8fafd", minHeight: "100%", py: { xs: 1, md: 2 } }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={0.75}>
              <Typography color="text.secondary" variant="subtitle2">
                Catalog / Storage
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1.75rem", md: "2rem" },
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
                variant="h4"
              >
                Create product
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Set up content, pricing, stock, media, and metadata in one
                clean product form.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.25}>
              <Button
                disableElevation
                onClick={resetForm}
                sx={buttonSx}
                type="button"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                disableElevation
                sx={buttonSx}
                type="submit"
                variant="contained"
              >
                Save product
              </Button>
            </Stack>
          </Stack>

          <Grid columnSpacing={2} container rowSpacing={2}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={2}>
                <Paper sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
                  <Stack spacing={2.5}>
                    <Stack spacing={0.75}>
                      <Typography sx={{ fontWeight: 600 }} variant="body1">
                        General information
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Start with the core product content customers and staff
                        will rely on first.
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Product title"
                        onChange={handleValueChange("title")}
                        required
                        sx={fieldSx}
                        value={values.title}
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        minRows={7}
                        multiline
                        onChange={handleValueChange("description")}
                        sx={fieldSx}
                        value={values.description}
                      />
                    </Stack>
                  </Stack>
                </Paper>

                <ProductMediaUpload
                  galleryImages={values.galleryImages}
                  mainImage={values.mainImage}
                  onGalleryChange={handleGalleryChange}
                  onMainImageChange={handleMainImageChange}
                  onRemoveGalleryImage={handleRemoveGalleryImage}
                  onRemoveMainImage={handleRemoveMainImage}
                />

                <ProductAttributesEditor
                  attributes={values.attributes}
                  onAddAttribute={handleAddAttribute}
                  onAddPresetAttribute={handleAddPresetAttribute}
                  onAttributeChange={handleAttributeChange}
                  onRemoveAttribute={handleRemoveAttribute}
                />

                <ProductSeoSection
                  description={values.seoDescription}
                  onDescriptionChange={(value) =>
                    setValues((currentValues) => ({
                      ...currentValues,
                      seoDescription: value,
                    }))
                  }
                  onTitleChange={(value) =>
                    setValues((currentValues) => ({
                      ...currentValues,
                      seoTitle: value,
                    }))
                  }
                  slug={generatedSlug}
                  title={values.seoTitle}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2}>
                <Paper sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
                  <Stack spacing={2.5}>
                    <Stack spacing={0.75}>
                      <Typography sx={{ fontWeight: 600 }} variant="body1">
                        Status
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Control product visibility and lifecycle before it goes
                        live.
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={1.5}>
                      <FormControl fullWidth>
                        <InputLabel id="product-status-label">Status</InputLabel>
                        <Select
                          label="Status"
                          labelId="product-status-label"
                          onChange={handleStatusChange}
                          sx={{
                            bgcolor: "#ffffff",
                            borderRadius: "2px",
                          }}
                          value={values.status}
                        >
                          {statusOptions.map((statusOption) => (
                            <MenuItem
                              key={statusOption.value}
                              value={statusOption.value}
                            >
                              {statusOption.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Chip
                        label={activeStatus.label}
                        sx={{
                          ...chipSx,
                          alignSelf: "flex-start",
                          bgcolor:
                            values.status === "active"
                              ? "#e6f4ea"
                              : values.status === "archived"
                                ? "#f1f3f4"
                                : "#fff8e1",
                          border: "1px solid #dce3eb",
                          color:
                            values.status === "active"
                              ? "#137333"
                              : values.status === "archived"
                                ? "#5f6368"
                                : "#8d6e00",
                        }}
                        variant="outlined"
                      />

                      <Typography color="text.secondary" variant="caption">
                        {activeStatus.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
                  <Stack spacing={2.5}>
                    <Stack spacing={0.75}>
                      <Typography sx={{ fontWeight: 600 }} variant="body1">
                        Pricing
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Define the current sell price and an optional compare-at
                        price.
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel id="product-currency-label">
                          Currency
                        </InputLabel>
                        <Select
                          label="Currency"
                          labelId="product-currency-label"
                          onChange={handleCurrencyChange}
                          sx={{
                            bgcolor: "#ffffff",
                            borderRadius: "2px",
                          }}
                          value={values.currency}
                        >
                          {currencyOptions.map((currencyOption) => (
                            <MenuItem
                              key={currencyOption.code}
                              value={currencyOption.code}
                            >
                              {currencyOption.code} ({currencyOption.symbol}) ·{" "}
                              {currencyOption.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label={`Price (${values.currency})`}
                        onChange={handleValueChange("price")}
                        required
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: "0.01",
                          },
                        }}
                        sx={fieldSx}
                        type="number"
                        value={values.price}
                      />
                      <TextField
                        fullWidth
                        label={`Old price / compare-at price (${values.currency})`}
                        onChange={handleValueChange("compareAtPrice")}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: "0.01",
                          },
                        }}
                        sx={fieldSx}
                        type="number"
                        value={values.compareAtPrice}
                      />
                    </Stack>
                  </Stack>
                </Paper>

                <ProductInventorySection
                  height={values.height}
                  length={values.length}
                  onHeightChange={(value) =>
                    setValues((currentValues) => ({
                      ...currentValues,
                      height: value,
                    }))
                  }
                  onLengthChange={(value) =>
                    setValues((currentValues) => ({
                      ...currentValues,
                      length: value,
                    }))
                  }
                  onSkuChange={(value) =>
                    setValues((currentValues) => ({
                      ...currentValues,
                      sku: value,
                    }))
                  }
                  onStockChange={(value) =>
                    setValues((currentValues) => ({
                      ...currentValues,
                      stock: value,
                    }))
                  }
                  onWeightChange={(value) =>
                    setValues((currentValues) => ({
                      ...currentValues,
                      weight: value,
                    }))
                  }
                  onWidthChange={(value) =>
                    setValues((currentValues) => ({
                      ...currentValues,
                      width: value,
                    }))
                  }
                  sku={values.sku}
                  stock={values.stock}
                  weight={values.weight}
                  width={values.width}
                />

                <Paper sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
                  <Stack spacing={2.5}>
                    <Stack spacing={0.75}>
                      <Typography sx={{ fontWeight: 600 }} variant="body1">
                        Organization
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Keep the catalog tidy with category, brand, and tags.
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Category"
                        onChange={handleValueChange("category")}
                        required
                        sx={fieldSx}
                        value={values.category}
                      />
                      <TextField
                        fullWidth
                        label="Brand / manufacturer"
                        onChange={handleValueChange("brand")}
                        sx={fieldSx}
                        value={values.brand}
                      />

                      <Stack spacing={1.25}>
                        <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
                          Tags
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <TextField
                            fullWidth
                            label="Add tag"
                            onChange={(event) => setTagInput(event.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="summer, sale, bestseller"
                            sx={fieldSx}
                            value={tagInput}
                          />
                          <Button
                            disableElevation
                            onClick={handleAddTag}
                            sx={buttonSx}
                            type="button"
                            variant="outlined"
                          >
                            Add
                          </Button>
                        </Stack>

                        {values.tags.length > 0 ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flexWrap: "wrap", gap: 1 }}
                          >
                            {values.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                onDelete={() =>
                                  setValues((currentValues) => ({
                                    ...currentValues,
                                    tags: currentValues.tags.filter(
                                      (currentTag) => currentTag !== tag,
                                    ),
                                  }))
                                }
                                sx={chipSx}
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography color="text.secondary" variant="body2">
                            Add comma-separated tags for search, filters, or
                            internal workflow.
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Box>

      <Snackbar
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        open={isSnackbarOpen}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          Product draft prepared in local state.
        </Alert>
      </Snackbar>
    </Box>
  );
}
