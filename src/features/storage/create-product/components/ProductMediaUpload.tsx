import type { ChangeEvent } from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  buttonSx,
  iconButtonSx,
  sectionCardSx,
  uploadZoneSx,
} from "../lib/styles";
import type { ProductImagePreview } from "../types";

type ProductMediaUploadProps = Readonly<{
  galleryImages: ProductImagePreview[];
  mainImage: ProductImagePreview | null;
  onGalleryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onMainImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryImage: (imageId: string) => void;
  onRemoveMainImage: () => void;
}>;

function formatFileSize(fileSize: number) {
  if (fileSize >= 1024 * 1024) {
    return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(fileSize / 1024))} KB`;
}

export function ProductMediaUpload({
  galleryImages,
  mainImage,
  onGalleryChange,
  onMainImageChange,
  onRemoveGalleryImage,
  onRemoveMainImage,
}: ProductMediaUploadProps) {
  return (
    <Paper sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Typography sx={{ fontWeight: 600 }} variant="body1">
            Media
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Add a main product image and a small gallery. Files stay in local
            state until backend upload is connected.
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={2.5}>
          <Stack spacing={1.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
                  Main photo
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  Used as the primary cover on product cards and detail pages.
                </Typography>
              </Stack>

              <Button
                component="label"
                disableElevation
                startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
                sx={buttonSx}
                variant="outlined"
              >
                Choose file
                <input
                  accept="image/*"
                  hidden
                  onChange={onMainImageChange}
                  type="file"
                />
              </Button>
            </Stack>

            <Box sx={uploadZoneSx}>
              {mainImage ? (
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ alignItems: { xs: "stretch", md: "center" }, width: 1 }}
                >
                  <Box
                    alt={mainImage.file.name}
                    component="img"
                    src={mainImage.previewUrl}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "2px",
                      height: 212,
                      objectFit: "cover",
                      width: { xs: "100%", md: 240 },
                    }}
                  />

                  <Stack
                    spacing={1}
                    sx={{
                      alignItems: "flex-start",
                      flex: 1,
                      justifyContent: "space-between",
                      minWidth: 0,
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography noWrap sx={{ fontWeight: 600 }} variant="body2">
                        {mainImage.file.name}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        {formatFileSize(mainImage.file.size)}
                      </Typography>
                    </Stack>

                    <IconButton
                      aria-label="Remove main photo"
                      onClick={onRemoveMainImage}
                      size="small"
                      sx={iconButtonSx}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={1.25} sx={{ alignItems: "center", maxWidth: 360 }}>
                  <AddPhotoAlternateOutlinedIcon color="action" />
                  <Typography sx={{ fontWeight: 600 }} variant="body2">
                    Upload a clean cover image
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                    variant="body2"
                  >
                    Recommended for the primary listing card and storefront
                    preview.
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>

          <Stack spacing={1.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
                  Gallery
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  Add alternate angles, detail shots, or packaging images.
                </Typography>
              </Stack>

              <Button
                component="label"
                disableElevation
                startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
                sx={buttonSx}
                variant="outlined"
              >
                Add images
                <input
                  accept="image/*"
                  hidden
                  multiple
                  onChange={onGalleryChange}
                  type="file"
                />
              </Button>
            </Stack>

            <Box sx={{ ...uploadZoneSx, minHeight: 144 }}>
              {galleryImages.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(3, minmax(0, 1fr))",
                      md: "repeat(4, minmax(0, 1fr))",
                    },
                    width: 1,
                  }}
                >
                  {galleryImages.map((image) => (
                    <Stack
                      key={image.id}
                      spacing={1}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "2px",
                        p: 1,
                      }}
                    >
                      <Box
                        alt={image.file.name}
                        component="img"
                        src={image.previewUrl}
                        sx={{
                          borderRadius: "2px",
                          height: 112,
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          color="text.secondary"
                          noWrap
                          variant="caption"
                        >
                          {image.file.name}
                        </Typography>
                        <IconButton
                          aria-label={`Remove ${image.file.name}`}
                          onClick={() => onRemoveGalleryImage(image.id)}
                          size="small"
                          sx={iconButtonSx}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  ))}
                </Box>
              ) : (
                <Stack spacing={1.25} sx={{ alignItems: "center", maxWidth: 360 }}>
                  <AddPhotoAlternateOutlinedIcon color="action" />
                  <Typography sx={{ fontWeight: 600 }} variant="body2">
                    Build a product gallery
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                    variant="body2"
                  >
                    Multiple files can be selected at once. Previews are shown
                    immediately in the grid.
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
