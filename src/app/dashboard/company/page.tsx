"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type MediaAsset = {
  fileName: string;
  id: string;
  previewUrl: string;
  size: number;
};

type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

type ServiceItem = {
  description: string;
  id: string;
  name: string;
  price: string;
};

type AdvantageItem = {
  description: string;
  id: string;
  title: string;
};

type FaqItem = {
  answer: string;
  id: string;
  question: string;
};

type BlockId =
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "advantages"
  | "faq"
  | "contacts";

type CompanyPageState = {
  aboutText: string;
  aboutTitle: string;
  address: string;
  advantages: AdvantageItem[];
  blocks: BlockId[];
  brandColor: string;
  category: string;
  city: string;
  country: string;
  coverImage: MediaAsset | null;
  ctaLabel: string;
  ctaNote: string;
  email: string;
  faqItems: FaqItem[];
  fullDescription: string;
  galleryImages: MediaAsset[];
  logo: MediaAsset | null;
  name: string;
  phone: string;
  services: ServiceItem[];
  shortDescription: string;
  socialLinks: SocialLink[];
  website: string;
  workingHours: string;
};

type SnackbarState = {
  message: string;
  open: boolean;
  severity: "info" | "success";
};

type EditorSectionProps = Readonly<{
  actions?: ReactNode;
  children: ReactNode;
  description: string;
  title: string;
}>;

type TabPanelProps = Readonly<{
  children: ReactNode;
  index: number;
  value: number;
}>;

type SingleAssetUploadProps = Readonly<{
  accept?: string;
  asset: MediaAsset | null;
  buttonLabel: string;
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  title: string;
}>;

const categoryOptions = [
  "Industrial services",
  "Consulting",
  "Manufacturing",
  "Technology",
  "Retail",
  "Healthcare",
  "Education",
  "Logistics",
  "Hospitality",
  "Professional services",
];

const blockDefinitions: Array<{
  description: string;
  id: BlockId;
  label: string;
}> = [
  {
    id: "hero",
    label: "Hero",
    description: "Banner, logo, title, short pitch, and CTA.",
  },
  {
    id: "about",
    label: "About",
    description: "Detailed company introduction and positioning.",
  },
  {
    id: "services",
    label: "Services",
    description: "Services or products shown as structured cards.",
  },
  {
    id: "gallery",
    label: "Gallery",
    description: "Uploaded company images and visual proof.",
  },
  {
    id: "advantages",
    label: "Advantages",
    description: "Reasons to choose the company.",
  },
  {
    id: "faq",
    label: "FAQ",
    description: "Frequently asked questions for visitors.",
  },
  {
    id: "contacts",
    label: "Contacts",
    description: "Address, channels, schedule, and social profiles.",
  },
];

const surfaceSx = {
  bgcolor: "#ffffff",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 0,
  boxShadow: "none",
};

const fieldSx = {
  "& .MuiInputBase-root": {
    bgcolor: "#ffffff",
    borderRadius: 0,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
  },
};

const buttonSx = {
  borderRadius: 0,
  boxShadow: "none",
  minHeight: 40,
  px: 1.75,
  textTransform: "none",
};

const iconButtonSx = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 0,
  color: "text.secondary",
};

const uploadZoneSx = {
  alignItems: "center",
  bgcolor: "#fafafa",
  border: "1px dashed",
  borderColor: "divider",
  borderRadius: 0,
  display: "flex",
  justifyContent: "center",
  minHeight: 180,
  p: 2,
};

let localIdCounter = 0;

function createLocalId(prefix: string) {
  localIdCounter += 1;

  return `${prefix}-${localIdCounter}`;
}

function createEmptyService(): ServiceItem {
  return {
    id: createLocalId("service"),
    name: "",
    description: "",
    price: "",
  };
}

function createEmptyAdvantage(): AdvantageItem {
  return {
    id: createLocalId("advantage"),
    title: "",
    description: "",
  };
}

function createEmptyFaq(): FaqItem {
  return {
    id: createLocalId("faq"),
    question: "",
    answer: "",
  };
}

function createEmptySocialLink(): SocialLink {
  return {
    id: createLocalId("social"),
    platform: "",
    url: "",
  };
}

function createInitialState(): CompanyPageState {
  return {
    name: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    city: "",
    country: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    workingHours: "",
    socialLinks: [],
    brandColor: "#1f4e79",
    logo: null,
    coverImage: null,
    galleryImages: [],
    services: [],
    aboutTitle: "",
    aboutText: "",
    advantages: [],
    faqItems: [],
    ctaLabel: "",
    ctaNote: "",
    blocks: [
      "hero",
      "about",
      "services",
      "gallery",
      "advantages",
      "faq",
      "contacts",
    ],
  };
}

function formatFileSize(fileSize: number) {
  if (fileSize >= 1024 * 1024) {
    return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(fileSize / 1024))} KB`;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);

  nextItems.splice(toIndex, 0, item);

  return nextItems;
}

function getFallbackValue(value: string, fallback: string) {
  return value.trim() || fallback;
}

function EditorSection({
  actions,
  children,
  description,
  title,
}: EditorSectionProps) {
  return (
    <Paper sx={{ ...surfaceSx, p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={0.5}>
            <Typography sx={{ fontWeight: 600 }} variant="body1">
              {title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          </Stack>

          {actions}
        </Stack>

        <Divider />
        {children}
      </Stack>
    </Paper>
  );
}

function TabPanel({ children, index, value }: TabPanelProps) {
  if (value !== index) {
    return null;
  }

  return <Stack spacing={2.5}>{children}</Stack>;
}

function SingleAssetUpload({
  accept = "image/*",
  asset,
  buttonLabel,
  description,
  emptyDescription,
  emptyTitle,
  onChange,
  onRemove,
  title,
}: SingleAssetUploadProps) {
  return (
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
            {title}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {description}
          </Typography>
        </Stack>

        <Button
          component="label"
          disableElevation
          startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
          sx={buttonSx}
          variant="outlined"
        >
          {buttonLabel}
          <input accept={accept} hidden onChange={onChange} type="file" />
        </Button>
      </Stack>

      <Box sx={uploadZoneSx}>
        {asset ? (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ alignItems: { xs: "stretch", md: "center" }, width: 1 }}
          >
            <Box
              alt={asset.fileName}
              component="img"
              src={asset.previewUrl}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                display: "block",
                height: 188,
                objectFit: "cover",
                width: { xs: "100%", md: 220 },
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
                  {asset.fileName}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {formatFileSize(asset.size)}
                </Typography>
              </Stack>

              <IconButton
                aria-label={`Remove ${title.toLowerCase()}`}
                onClick={onRemove}
                size="small"
                sx={iconButtonSx}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1} sx={{ alignItems: "center", maxWidth: 360 }}>
            <CloudUploadOutlinedIcon color="action" />
            <Typography sx={{ fontWeight: 600 }} variant="body2">
              {emptyTitle}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center" }}
              variant="body2"
            >
              {emptyDescription}
            </Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

function PreviewSectionHeader({
  color,
  title,
}: Readonly<{ color: string; title: string }>) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{ alignItems: "center", mb: 2.5, minWidth: 0 }}
    >
      <Box sx={{ bgcolor: color, height: 18, width: 4 }} />
      <Typography sx={{ fontWeight: 600 }} variant="h6">
        {title}
      </Typography>
    </Stack>
  );
}

function CompanyPagePreview({
  data,
}: Readonly<{
  data: CompanyPageState;
}>) {
  const previewName = getFallbackValue(data.name, "Company name");
  const previewShortDescription = getFallbackValue(
    data.shortDescription,
    "Add a short description to introduce the company in the hero section.",
  );
  const previewAboutTitle = getFallbackValue(
    data.aboutTitle,
    "About the company",
  );
  const previewAboutText = getFallbackValue(
    data.aboutText || data.fullDescription,
    "Use the About block to explain what the company does, who it serves, and why visitors should trust it.",
  );
  const previewCategory = getFallbackValue(data.category, "Category");
  const previewLocation = [data.city.trim(), data.country.trim()]
    .filter(Boolean)
    .join(", ");
  const previewContactItems = [
    {
      label: "Email",
      value: getFallbackValue(data.email, "email@company.com"),
    },
    {
      label: "Phone",
      value: getFallbackValue(data.phone, "+1 000 000 0000"),
    },
    {
      label: "Website",
      value: getFallbackValue(data.website, "company-site.com"),
    },
    {
      label: "Address",
      value: getFallbackValue(data.address, "Company address"),
    },
    {
      label: "Working hours",
      value: getFallbackValue(data.workingHours, "Add opening hours"),
    },
    {
      label: "Location",
      value: previewLocation || "City, Country",
    },
  ];

  const renderBlock = (blockId: BlockId) => {
    switch (blockId) {
      case "hero":
        return (
          <Box key={blockId}>
            <Box
              sx={{
                bgcolor: "#f3f4f6",
                borderBottom: "1px solid",
                borderColor: "divider",
                minHeight: { xs: 220, md: 300 },
                position: "relative",
              }}
            >
              {data.coverImage ? (
                <Box
                  alt={data.coverImage.fileName}
                  component="img"
                  src={data.coverImage.previewUrl}
                  sx={{
                    display: "block",
                    height: "100%",
                    inset: 0,
                    objectFit: "cover",
                    position: "absolute",
                    width: "100%",
                  }}
                />
              ) : (
                <Stack
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    color: "text.secondary",
                    height: "100%",
                    inset: 0,
                    justifyContent: "center",
                    position: "absolute",
                  }}
                >
                  <Typography variant="overline">Cover image</Typography>
                  <Typography variant="body2">
                    Upload a banner to replace this placeholder.
                  </Typography>
                </Stack>
              )}
            </Box>

            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Grid columnSpacing={3} container rowSpacing={2.5}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box
                    sx={{
                      ...surfaceSx,
                      alignItems: "center",
                      aspectRatio: "1 / 1",
                      bgcolor: "#fafafa",
                      display: "flex",
                      justifyContent: "center",
                      maxWidth: { xs: 140, md: 164 },
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    {data.logo ? (
                      <Box
                        alt={data.logo.fileName}
                        component="img"
                        src={data.logo.previewUrl}
                        sx={{
                          display: "block",
                          height: "100%",
                          objectFit: "contain",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <Typography color="text.secondary" variant="body2">
                        Logo preview
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                  <Stack spacing={2.25}>
                    <Stack spacing={1}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{
                          alignItems: { xs: "flex-start", sm: "center" },
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={previewCategory}
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 0,
                            boxShadow: "none",
                            fontWeight: 500,
                          }}
                          variant="outlined"
                        />
                        <Typography color="text.secondary" variant="body2">
                          {previewLocation || "City, Country"}
                        </Typography>
                      </Stack>

                      <Typography sx={{ fontWeight: 700 }} variant="h4">
                        {previewName}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ maxWidth: 760 }}
                        variant="body1"
                      >
                        {previewShortDescription}
                      </Typography>
                    </Stack>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.25}
                      sx={{ alignItems: { xs: "stretch", sm: "center" } }}
                    >
                      <Button
                        disableElevation
                        sx={{
                          ...buttonSx,
                          bgcolor: data.brandColor,
                          border: "1px solid",
                          borderColor: data.brandColor,
                          color: "#ffffff",
                          "&:hover": {
                            bgcolor: data.brandColor,
                          },
                        }}
                        variant="contained"
                      >
                        {getFallbackValue(data.ctaLabel, "Primary action")}
                      </Button>
                      <Typography color="text.secondary" variant="body2">
                        {getFallbackValue(
                          data.ctaNote,
                          "Explain what happens after the CTA click.",
                        )}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case "about":
        return (
          <Box key={blockId} sx={{ p: { xs: 2, md: 4 } }}>
            <PreviewSectionHeader
              color={data.brandColor}
              title={previewAboutTitle}
            />
            <Stack spacing={2}>
              <Typography color="text.secondary" variant="body1">
                {previewAboutText}
              </Typography>
              <Divider />
              <Typography color="text.secondary" variant="body1">
                {getFallbackValue(
                  data.fullDescription,
                  "Add the full description in the editor to show a richer company story here.",
                )}
              </Typography>
            </Stack>
          </Box>
        );

      case "services":
        return (
          <Box key={blockId} sx={{ p: { xs: 2, md: 4 } }}>
            <PreviewSectionHeader
              color={data.brandColor}
              title="Services & products"
            />
            <Grid columnSpacing={2} container rowSpacing={2}>
              {data.services.length > 0 ? (
                data.services.map((service) => (
                  <Grid key={service.id} size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ ...surfaceSx, height: "100%", p: 2.25 }}>
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ fontWeight: 600 }} variant="body1">
                            {getFallbackValue(service.name, "Untitled service")}
                          </Typography>
                          <Typography
                            sx={{ color: data.brandColor }}
                            variant="body2"
                          >
                            {getFallbackValue(
                              service.price,
                              "Price on request",
                            )}
                          </Typography>
                        </Stack>
                        <Typography color="text.secondary" variant="body2">
                          {getFallbackValue(
                            service.description,
                            "Describe the value, delivery format, or scope of this offer.",
                          )}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ ...surfaceSx, p: 2.5 }}>
                    <Typography color="text.secondary" variant="body2">
                      Add services or products in the editor to populate this
                      block.
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case "gallery":
        return (
          <Box key={blockId} sx={{ p: { xs: 2, md: 4 } }}>
            <PreviewSectionHeader color={data.brandColor} title="Gallery" />
            {data.galleryImages.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "repeat(1, minmax(0, 1fr))",
                    sm: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(3, minmax(0, 1fr))",
                  },
                }}
              >
                {data.galleryImages.map((image) => (
                  <Paper
                    key={image.id}
                    sx={{
                      ...surfaceSx,
                      bgcolor: "#fafafa",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      alt={image.fileName}
                      component="img"
                      src={image.previewUrl}
                      sx={{
                        display: "block",
                        height: 220,
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    <Box sx={{ p: 1.5 }}>
                      <Typography noWrap variant="body2">
                        {image.fileName}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Paper sx={{ ...surfaceSx, bgcolor: "#fafafa", p: 2.5 }}>
                <Typography color="text.secondary" variant="body2">
                  Upload gallery images to show office, production, portfolio,
                  or product visuals here.
                </Typography>
              </Paper>
            )}
          </Box>
        );

      case "advantages":
        return (
          <Box key={blockId} sx={{ p: { xs: 2, md: 4 } }}>
            <PreviewSectionHeader color={data.brandColor} title="Advantages" />
            <Grid columnSpacing={2} container rowSpacing={2}>
              {data.advantages.length > 0 ? (
                data.advantages.map((advantage) => (
                  <Grid key={advantage.id} size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ ...surfaceSx, height: "100%", p: 2.25 }}>
                      <Stack spacing={1}>
                        <Typography sx={{ fontWeight: 600 }} variant="body1">
                          {getFallbackValue(advantage.title, "Key advantage")}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {getFallbackValue(
                            advantage.description,
                            "Explain the operational, commercial, or brand advantage here.",
                          )}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ ...surfaceSx, p: 2.5 }}>
                    <Typography color="text.secondary" variant="body2">
                      Add a few reasons visitors should choose this company.
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case "faq":
        return (
          <Box key={blockId} sx={{ p: { xs: 2, md: 4 } }}>
            <PreviewSectionHeader color={data.brandColor} title="FAQ" />
            <Stack spacing={1.5}>
              {data.faqItems.length > 0 ? (
                data.faqItems.map((item) => (
                  <Paper key={item.id} sx={{ ...surfaceSx, p: 2.25 }}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontWeight: 600 }} variant="body1">
                        {getFallbackValue(item.question, "FAQ question")}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {getFallbackValue(
                          item.answer,
                          "Add a clear answer so visitors understand expectations before they contact you.",
                        )}
                      </Typography>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Paper sx={{ ...surfaceSx, p: 2.5 }}>
                  <Typography color="text.secondary" variant="body2">
                    Add FAQ items to reduce friction before the visitor reaches
                    out.
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        );

      case "contacts":
        return (
          <Box key={blockId} sx={{ p: { xs: 2, md: 4 } }}>
            <PreviewSectionHeader color={data.brandColor} title="Contacts" />
            <Grid columnSpacing={2} container rowSpacing={2}>
              {previewContactItems.map((item) => (
                <Grid key={item.label} size={{ xs: 12, sm: 6, xl: 4 }}>
                  <Paper sx={{ ...surfaceSx, height: "100%", p: 2 }}>
                    <Stack spacing={0.5}>
                      <Typography color="text.secondary" variant="caption">
                        {item.label}
                      </Typography>
                      <Typography variant="body2">{item.value}</Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Stack spacing={1.25} sx={{ mt: 2.5 }}>
              <Typography sx={{ fontWeight: 600 }} variant="body1">
                Social links
              </Typography>
              {data.socialLinks.length > 0 ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap", gap: 1 }}
                >
                  {data.socialLinks.map((link) => (
                    <Chip
                      key={link.id}
                      label={`${getFallbackValue(link.platform, "Channel")}: ${getFallbackValue(link.url, "Add URL")}`}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 0,
                        boxShadow: "none",
                        maxWidth: "100%",
                      }}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  Add social links to complete the public profile.
                </Typography>
              )}
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={{ ...surfaceSx, overflow: "hidden" }}>
      <Box
        sx={{
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, md: 3 },
          py: 1.5,
        }}
      >
        <Stack spacing={0.25}>
          <Typography sx={{ fontWeight: 600 }} variant="body1">
            Published page preview
          </Typography>
          <Typography color="text.secondary" variant="caption">
            company.example.com/{previewName.toLowerCase().replace(/\s+/g, "-")}
          </Typography>
        </Stack>

        <Chip
          label="Draft view"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 0,
            boxShadow: "none",
          }}
          variant="outlined"
        />
      </Box>

      <Box
        sx={{
          bgcolor: "#ffffff",
          color: "text.primary",
        }}
      >
        {data.blocks.map((blockId, index) => (
          <Box
            key={blockId}
            sx={{
              borderTop: index === 0 ? "none" : "1px solid",
              borderColor: "divider",
            }}
          >
            {renderBlock(blockId)}
          </Box>
        ))}
      </Box>
    </Card>
  );
}

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [blocksTab, setBlocksTab] = useState(0);
  const [pageState, setPageState] = useState<CompanyPageState>(() =>
    createInitialState(),
  );
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });
  const previewRef = useRef<HTMLDivElement | null>(null);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const previewUrls = previewUrlsRef;

    return () => {
      previewUrls.current.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  const handleFieldChange =
    (
      field: keyof Pick<
        CompanyPageState,
        | "name"
        | "shortDescription"
        | "fullDescription"
        | "city"
        | "country"
        | "email"
        | "phone"
        | "website"
        | "address"
        | "workingHours"
        | "aboutTitle"
        | "aboutText"
        | "brandColor"
        | "ctaLabel"
        | "ctaNote"
      >,
    ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageState((currentState) => ({
        ...currentState,
        [field]: event.target.value,
      }));
    };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setPageState((currentState) => ({
      ...currentState,
      category: event.target.value,
    }));
  };

  const createMediaAsset = (file: File): MediaAsset => {
    const previewUrl = URL.createObjectURL(file);

    previewUrlsRef.current.push(previewUrl);

    return {
      id: createLocalId("media"),
      fileName: file.name,
      previewUrl,
      size: file.size,
    };
  };

  const revokePreviewUrl = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    previewUrlsRef.current = previewUrlsRef.current.filter(
      (currentPreviewUrl) => currentPreviewUrl !== previewUrl,
    );
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextLogo = createMediaAsset(file);

    setPageState((currentState) => {
      if (currentState.logo) {
        revokePreviewUrl(currentState.logo.previewUrl);
      }

      return {
        ...currentState,
        logo: nextLogo,
      };
    });

    event.target.value = "";
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextCover = createMediaAsset(file);

    setPageState((currentState) => {
      if (currentState.coverImage) {
        revokePreviewUrl(currentState.coverImage.previewUrl);
      }

      return {
        ...currentState,
        coverImage: nextCover,
      };
    });

    event.target.value = "";
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const nextImages = files.map((file) => createMediaAsset(file));

    setPageState((currentState) => ({
      ...currentState,
      galleryImages: [...currentState.galleryImages, ...nextImages],
    }));

    event.target.value = "";
  };

  const handleRemoveLogo = () => {
    setPageState((currentState) => {
      if (currentState.logo) {
        revokePreviewUrl(currentState.logo.previewUrl);
      }

      return {
        ...currentState,
        logo: null,
      };
    });
  };

  const handleRemoveCover = () => {
    setPageState((currentState) => {
      if (currentState.coverImage) {
        revokePreviewUrl(currentState.coverImage.previewUrl);
      }

      return {
        ...currentState,
        coverImage: null,
      };
    });
  };

  const handleRemoveGalleryImage = (imageId: string) => {
    setPageState((currentState) => {
      const imageToRemove = currentState.galleryImages.find(
        (image) => image.id === imageId,
      );

      if (imageToRemove) {
        revokePreviewUrl(imageToRemove.previewUrl);
      }

      return {
        ...currentState,
        galleryImages: currentState.galleryImages.filter(
          (image) => image.id !== imageId,
        ),
      };
    });
  };

  const handleAddService = () => {
    setPageState((currentState) => ({
      ...currentState,
      services: [...currentState.services, createEmptyService()],
    }));
  };

  const handleServiceChange = (
    serviceId: string,
    field: keyof Omit<ServiceItem, "id">,
    value: string,
  ) => {
    setPageState((currentState) => ({
      ...currentState,
      services: currentState.services.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service,
      ),
    }));
  };

  const handleRemoveService = (serviceId: string) => {
    setPageState((currentState) => ({
      ...currentState,
      services: currentState.services.filter(
        (service) => service.id !== serviceId,
      ),
    }));
  };

  const handleAddAdvantage = () => {
    setPageState((currentState) => ({
      ...currentState,
      advantages: [...currentState.advantages, createEmptyAdvantage()],
    }));
  };

  const handleAdvantageChange = (
    advantageId: string,
    field: keyof Omit<AdvantageItem, "id">,
    value: string,
  ) => {
    setPageState((currentState) => ({
      ...currentState,
      advantages: currentState.advantages.map((advantage) =>
        advantage.id === advantageId
          ? { ...advantage, [field]: value }
          : advantage,
      ),
    }));
  };

  const handleRemoveAdvantage = (advantageId: string) => {
    setPageState((currentState) => ({
      ...currentState,
      advantages: currentState.advantages.filter(
        (advantage) => advantage.id !== advantageId,
      ),
    }));
  };

  const handleAddFaq = () => {
    setPageState((currentState) => ({
      ...currentState,
      faqItems: [...currentState.faqItems, createEmptyFaq()],
    }));
  };

  const handleFaqChange = (
    faqId: string,
    field: keyof Omit<FaqItem, "id">,
    value: string,
  ) => {
    setPageState((currentState) => ({
      ...currentState,
      faqItems: currentState.faqItems.map((faqItem) =>
        faqItem.id === faqId ? { ...faqItem, [field]: value } : faqItem,
      ),
    }));
  };

  const handleRemoveFaq = (faqId: string) => {
    setPageState((currentState) => ({
      ...currentState,
      faqItems: currentState.faqItems.filter((faqItem) => faqItem.id !== faqId),
    }));
  };

  const handleAddSocialLink = () => {
    setPageState((currentState) => ({
      ...currentState,
      socialLinks: [...currentState.socialLinks, createEmptySocialLink()],
    }));
  };

  const handleSocialLinkChange = (
    socialLinkId: string,
    field: keyof Omit<SocialLink, "id">,
    value: string,
  ) => {
    setPageState((currentState) => ({
      ...currentState,
      socialLinks: currentState.socialLinks.map((socialLink) =>
        socialLink.id === socialLinkId
          ? { ...socialLink, [field]: value }
          : socialLink,
      ),
    }));
  };

  const handleRemoveSocialLink = (socialLinkId: string) => {
    setPageState((currentState) => ({
      ...currentState,
      socialLinks: currentState.socialLinks.filter(
        (socialLink) => socialLink.id !== socialLinkId,
      ),
    }));
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    setPageState((currentState) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= currentState.blocks.length) {
        return currentState;
      }

      return {
        ...currentState,
        blocks: moveItem(currentState.blocks, index, targetIndex),
      };
    });
  };

  const handleReset = () => {
    setPageState((currentState) => {
      const assetsToRevoke = [
        currentState.logo,
        currentState.coverImage,
        ...currentState.galleryImages,
      ].filter(Boolean);

      assetsToRevoke.forEach((asset) => {
        revokePreviewUrl((asset as MediaAsset).previewUrl);
      });

      return createInitialState();
    });

    setActiveTab(0);
    setBlocksTab(0);
    setSnackbarState({
      open: true,
      message: "The builder was reset to an empty draft.",
      severity: "info",
    });
  };

  const handlePreview = () => {
    previewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePublishDemo = () => {
    setSnackbarState({
      open: true,
      message: "Demo publish simulated. Nothing was saved or sent to a server.",
      severity: "success",
    });
  };

  const renderBlocksPanel = () => (
    <TabPanel index={2} value={activeTab}>
      <Paper sx={{ ...surfaceSx, p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={2.5}>
          <Tabs
            allowScrollButtonsMobile
            onChange={(_, nextTab: number) => setBlocksTab(nextTab)}
            scrollButtons="auto"
            sx={{
              minHeight: 44,
              "& .MuiTab-root": {
                alignItems: "flex-start",
                borderRadius: 0,
                minHeight: 44,
                px: 2,
                textTransform: "none",
              },
            }}
            value={blocksTab}
            variant="scrollable"
          >
            <Tab label="Order" />
            <Tab label="About" />
            <Tab label="Services" />
            <Tab label="Advantages" />
            <Tab label="FAQ" />
          </Tabs>

          <TabPanel index={0} value={blocksTab}>
            <EditorSection
              description="Drag and drop is simulated with ordered controls because no dedicated DnD library is configured here."
              title="Block order"
            >
              <Stack spacing={1.25}>
                {pageState.blocks.map((blockId, index) => {
                  const blockDefinition = blockDefinitions.find(
                    (block) => block.id === blockId,
                  );

                  if (!blockDefinition) {
                    return null;
                  }

                  return (
                    <Paper
                      key={blockDefinition.id}
                      sx={{ ...surfaceSx, bgcolor: "#fafafa", p: 1.5 }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.25}
                        sx={{
                          alignItems: { xs: "flex-start", sm: "center" },
                          justifyContent: "space-between",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.25}
                          sx={{ alignItems: "center" }}
                        >
                          <DragIndicatorIcon color="action" fontSize="small" />
                          <Stack spacing={0.25}>
                            <Typography
                              sx={{ fontWeight: 600 }}
                              variant="body2"
                            >
                              {blockDefinition.label}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              variant="caption"
                            >
                              {blockDefinition.description}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <IconButton
                            aria-label={`Move ${blockDefinition.label} up`}
                            disabled={index === 0}
                            onClick={() => handleMoveBlock(index, "up")}
                            size="small"
                            sx={iconButtonSx}
                          >
                            <ArrowUpwardOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label={`Move ${blockDefinition.label} down`}
                            disabled={index === pageState.blocks.length - 1}
                            onClick={() => handleMoveBlock(index, "down")}
                            size="small"
                            sx={iconButtonSx}
                          >
                            <ArrowDownwardOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </EditorSection>
          </TabPanel>

          <TabPanel index={1} value={blocksTab}>
            <EditorSection
              description="This content becomes the core narrative block in the published preview."
              title="About block"
            >
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  helperText="Public heading for the About section."
                  label="About title"
                  onChange={handleFieldChange("aboutTitle")}
                  sx={fieldSx}
                  value={pageState.aboutTitle}
                />
                <TextField
                  fullWidth
                  helperText="Use this for a focused company summary that appears in the About block."
                  label="About text"
                  minRows={5}
                  multiline
                  onChange={handleFieldChange("aboutText")}
                  sx={fieldSx}
                  value={pageState.aboutText}
                />
              </Stack>
            </EditorSection>
          </TabPanel>

          <TabPanel index={2} value={blocksTab}>
            <EditorSection
              actions={
                <Button
                  disableElevation
                  onClick={handleAddService}
                  startIcon={<AddOutlinedIcon fontSize="small" />}
                  sx={buttonSx}
                  variant="outlined"
                >
                  Add item
                </Button>
              }
              description="List the core offers that should appear as cards in the public preview."
              title="Services or products"
            >
              <Stack spacing={1.5}>
                {pageState.services.map((service) => (
                  <Paper
                    key={service.id}
                    sx={{ ...surfaceSx, bgcolor: "#fafafa", p: 1.75 }}
                  >
                    <Stack spacing={1.5}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 600 }}
                          variant="subtitle2"
                        >
                          Service card
                        </Typography>
                        <IconButton
                          aria-label="Remove service"
                          onClick={() => handleRemoveService(service.id)}
                          size="small"
                          sx={iconButtonSx}
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Grid columnSpacing={1.5} container rowSpacing={1.5}>
                        <Grid size={{ xs: 12, md: 7 }}>
                          <TextField
                            fullWidth
                            label="Name"
                            onChange={(event) =>
                              handleServiceChange(
                                service.id,
                                "name",
                                event.target.value,
                              )
                            }
                            sx={fieldSx}
                            value={service.name}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                          <TextField
                            fullWidth
                            label="Price or label"
                            onChange={(event) =>
                              handleServiceChange(
                                service.id,
                                "price",
                                event.target.value,
                              )
                            }
                            placeholder="from $1,000"
                            sx={fieldSx}
                            value={service.price}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Description"
                            minRows={3}
                            multiline
                            onChange={(event) =>
                              handleServiceChange(
                                service.id,
                                "description",
                                event.target.value,
                              )
                            }
                            sx={fieldSx}
                            value={service.description}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </EditorSection>
          </TabPanel>

          <TabPanel index={3} value={blocksTab}>
            <EditorSection
              actions={
                <Button
                  disableElevation
                  onClick={handleAddAdvantage}
                  startIcon={<AddOutlinedIcon fontSize="small" />}
                  sx={buttonSx}
                  variant="outlined"
                >
                  Add advantage
                </Button>
              }
              description="Summarize the strongest proof points or operational benefits."
              title="Advantages"
            >
              <Stack spacing={1.5}>
                {pageState.advantages.map((advantage) => (
                  <Paper
                    key={advantage.id}
                    sx={{ ...surfaceSx, bgcolor: "#fafafa", p: 1.75 }}
                  >
                    <Stack spacing={1.5}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 600 }}
                          variant="subtitle2"
                        >
                          Advantage card
                        </Typography>
                        <IconButton
                          aria-label="Remove advantage"
                          onClick={() => handleRemoveAdvantage(advantage.id)}
                          size="small"
                          sx={iconButtonSx}
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <TextField
                        fullWidth
                        label="Title"
                        onChange={(event) =>
                          handleAdvantageChange(
                            advantage.id,
                            "title",
                            event.target.value,
                          )
                        }
                        sx={fieldSx}
                        value={advantage.title}
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        minRows={3}
                        multiline
                        onChange={(event) =>
                          handleAdvantageChange(
                            advantage.id,
                            "description",
                            event.target.value,
                          )
                        }
                        sx={fieldSx}
                        value={advantage.description}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </EditorSection>
          </TabPanel>

          <TabPanel index={4} value={blocksTab}>
            <EditorSection
              actions={
                <Button
                  disableElevation
                  onClick={handleAddFaq}
                  startIcon={<AddOutlinedIcon fontSize="small" />}
                  sx={buttonSx}
                  variant="outlined"
                >
                  Add question
                </Button>
              }
              description="Help visitors answer key questions before they contact the business."
              title="FAQ"
            >
              <Stack spacing={1.5}>
                {pageState.faqItems.map((faqItem) => (
                  <Paper
                    key={faqItem.id}
                    sx={{ ...surfaceSx, bgcolor: "#fafafa", p: 1.75 }}
                  >
                    <Stack spacing={1.5}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 600 }}
                          variant="subtitle2"
                        >
                          FAQ item
                        </Typography>
                        <IconButton
                          aria-label="Remove FAQ item"
                          onClick={() => handleRemoveFaq(faqItem.id)}
                          size="small"
                          sx={iconButtonSx}
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <TextField
                        fullWidth
                        label="Question"
                        onChange={(event) =>
                          handleFaqChange(
                            faqItem.id,
                            "question",
                            event.target.value,
                          )
                        }
                        sx={fieldSx}
                        value={faqItem.question}
                      />
                      <TextField
                        fullWidth
                        label="Answer"
                        minRows={3}
                        multiline
                        onChange={(event) =>
                          handleFaqChange(
                            faqItem.id,
                            "answer",
                            event.target.value,
                          )
                        }
                        sx={fieldSx}
                        value={faqItem.answer}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </EditorSection>
          </TabPanel>
        </Stack>
      </Paper>
    </TabPanel>
  );

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          xl: "minmax(0, 460px) minmax(0, 1fr)",
        },
        width: "100%",
      }}
    >
      <Stack spacing={3} sx={{ minWidth: 0 }}>
        <Paper sx={{ ...surfaceSx, p: { xs: 2, md: 2.5 } }}>
          <Stack spacing={2.5}>
            <Stack spacing={2}>
              <Stack spacing={0.75}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexWrap: "wrap",
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }} variant="h5">
                    Company Page Builder
                  </Typography>
                  <Chip
                    label="Draft"
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 0,
                      boxShadow: "none",
                      fontWeight: 500,
                    }}
                    variant="outlined"
                  />
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  Configure company content on the left and review the published
                  layout instantly on the right. All state is local to this
                  page.
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ width: { xs: 1, sm: "auto" } }}
              >
                <Button
                  disableElevation
                  onClick={handlePreview}
                  startIcon={<PreviewOutlinedIcon fontSize="small" />}
                  sx={buttonSx}
                  variant="outlined"
                >
                  Preview
                </Button>
                <Button
                  disableElevation
                  onClick={handleReset}
                  startIcon={<RestartAltOutlinedIcon fontSize="small" />}
                  sx={buttonSx}
                  variant="outlined"
                >
                  Reset
                </Button>
                <Button
                  disableElevation
                  onClick={handlePublishDemo}
                  startIcon={<PublishOutlinedIcon fontSize="small" />}
                  sx={{
                    ...buttonSx,
                    bgcolor: pageState.brandColor,
                    border: "1px solid",
                    borderColor: pageState.brandColor,
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: pageState.brandColor,
                    },
                  }}
                  variant="contained"
                >
                  Publish demo
                </Button>
              </Stack>
            </Stack>

            <Divider />

            <Tabs
              allowScrollButtonsMobile
              onChange={(_, nextTab: number) => setActiveTab(nextTab)}
              scrollButtons="auto"
              sx={{
                minHeight: 44,
                "& .MuiTab-root": {
                  alignItems: "flex-start",
                  borderRadius: 0,
                  minHeight: 44,
                  px: 2,
                  textTransform: "none",
                },
              }}
              value={activeTab}
              variant="scrollable"
            >
              <Tab label="General" />
              <Tab label="Media" />
              <Tab label="Blocks" />
              <Tab label="Contacts" />
              <Tab label="Settings" />
            </Tabs>

            <TabPanel index={0} value={activeTab}>
              <EditorSection
                description="Core identity fields that shape the hero section and search-facing summary."
                title="Company profile"
              >
                <Grid columnSpacing={1.5} container rowSpacing={1.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      helperText="Shown as the main company title in the live preview."
                      label="Company name"
                      onChange={handleFieldChange("name")}
                      sx={fieldSx}
                      value={pageState.name}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        label="Category"
                        onChange={handleCategoryChange}
                        sx={fieldSx}
                        value={pageState.category}
                      >
                        {categoryOptions.map((categoryOption) => (
                          <MenuItem key={categoryOption} value={categoryOption}>
                            {categoryOption}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="City"
                      onChange={handleFieldChange("city")}
                      sx={fieldSx}
                      value={pageState.city}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Country"
                      onChange={handleFieldChange("country")}
                      sx={fieldSx}
                      value={pageState.country}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      helperText="Short pitch placed in the hero section."
                      label="Short description"
                      minRows={3}
                      multiline
                      onChange={handleFieldChange("shortDescription")}
                      sx={fieldSx}
                      value={pageState.shortDescription}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      helperText="Longer public description that supports the About block."
                      label="Full description"
                      minRows={5}
                      multiline
                      onChange={handleFieldChange("fullDescription")}
                      sx={fieldSx}
                      value={pageState.fullDescription}
                    />
                  </Grid>
                </Grid>
              </EditorSection>
            </TabPanel>

            <TabPanel index={1} value={activeTab}>
              <EditorSection
                description="Upload a logo, a cover image, and supporting gallery visuals. Files stay in local state only."
                title="Media assets"
              >
                <Stack spacing={3}>
                  <SingleAssetUpload
                    asset={pageState.logo}
                    buttonLabel="Upload logo"
                    description="Square or landscape brand mark for the preview header."
                    emptyDescription="A logo is shown next to the company introduction in the hero section."
                    emptyTitle="No logo selected"
                    onChange={handleLogoChange}
                    onRemove={handleRemoveLogo}
                    title="Logo"
                  />

                  <Divider />

                  <SingleAssetUpload
                    asset={pageState.coverImage}
                    buttonLabel="Upload cover"
                    description="Wide banner image shown at the top of the live page preview."
                    emptyDescription="Use a workplace, team, product, or architecture shot to make the header feel published."
                    emptyTitle="No cover image selected"
                    onChange={handleCoverChange}
                    onRemove={handleRemoveCover}
                    title="Cover image"
                  />
                </Stack>
              </EditorSection>

              <EditorSection
                actions={
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
                      onChange={handleGalleryChange}
                      type="file"
                    />
                  </Button>
                }
                description="Add multiple images for office shots, product visuals, or case-study proof."
                title="Gallery"
              >
                <Box sx={{ ...uploadZoneSx, minHeight: 160 }}>
                  {pageState.galleryImages.length > 0 ? (
                    <Box
                      sx={{
                        display: "grid",
                        gap: 1.5,
                        gridTemplateColumns: {
                          xs: "repeat(2, minmax(0, 1fr))",
                          md: "repeat(3, minmax(0, 1fr))",
                        },
                        width: 1,
                      }}
                    >
                      {pageState.galleryImages.map((image) => (
                        <Paper
                          key={image.id}
                          sx={{ ...surfaceSx, bgcolor: "#ffffff", p: 1 }}
                        >
                          <Stack spacing={1}>
                            <Box
                              alt={image.fileName}
                              component="img"
                              src={image.previewUrl}
                              sx={{
                                display: "block",
                                height: 120,
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
                                {image.fileName}
                              </Typography>
                              <IconButton
                                aria-label={`Remove ${image.fileName}`}
                                onClick={() =>
                                  handleRemoveGalleryImage(image.id)
                                }
                                size="small"
                                sx={iconButtonSx}
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Stack
                      spacing={1}
                      sx={{ alignItems: "center", maxWidth: 360 }}
                    >
                      <CloudUploadOutlinedIcon color="action" />
                      <Typography sx={{ fontWeight: 600 }} variant="body2">
                        Add gallery images
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                        variant="body2"
                      >
                        Uploaded files appear here immediately using temporary
                        browser URLs.
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </EditorSection>
            </TabPanel>

            {renderBlocksPanel()}

            <TabPanel index={3} value={activeTab}>
              <EditorSection
                description="Public contact details used in the Contacts block and summary areas."
                title="Contact information"
              >
                <Grid columnSpacing={1.5} container rowSpacing={1.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      onChange={handleFieldChange("email")}
                      sx={fieldSx}
                      value={pageState.email}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      onChange={handleFieldChange("phone")}
                      sx={fieldSx}
                      value={pageState.phone}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      helperText="Stored as text only for now. No validation or request is triggered."
                      label="Website"
                      onChange={handleFieldChange("website")}
                      sx={fieldSx}
                      value={pageState.website}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address"
                      minRows={3}
                      multiline
                      onChange={handleFieldChange("address")}
                      sx={fieldSx}
                      value={pageState.address}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      helperText="Example: Mon - Fri, 09:00 - 18:00"
                      label="Working hours"
                      onChange={handleFieldChange("workingHours")}
                      sx={fieldSx}
                      value={pageState.workingHours}
                    />
                  </Grid>
                </Grid>
              </EditorSection>

              <EditorSection
                actions={
                  <Button
                    disableElevation
                    onClick={handleAddSocialLink}
                    startIcon={<AddOutlinedIcon fontSize="small" />}
                    sx={buttonSx}
                    variant="outlined"
                  >
                    Add social link
                  </Button>
                }
                description="Add public social channels one by one. The preview shows them as flat chips."
                title="Social networks"
              >
                <Stack spacing={1.5}>
                  {pageState.socialLinks.map((socialLink) => (
                    <Paper
                      key={socialLink.id}
                      sx={{ ...surfaceSx, bgcolor: "#fafafa", p: 1.75 }}
                    >
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 600 }}
                            variant="subtitle2"
                          >
                            Social profile
                          </Typography>
                          <IconButton
                            aria-label="Remove social link"
                            onClick={() =>
                              handleRemoveSocialLink(socialLink.id)
                            }
                            size="small"
                            sx={iconButtonSx}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Grid columnSpacing={1.5} container rowSpacing={1.5}>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                              fullWidth
                              label="Platform"
                              onChange={(event) =>
                                handleSocialLinkChange(
                                  socialLink.id,
                                  "platform",
                                  event.target.value,
                                )
                              }
                              placeholder="LinkedIn"
                              sx={fieldSx}
                              value={socialLink.platform}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                              fullWidth
                              label="URL or handle"
                              onChange={(event) =>
                                handleSocialLinkChange(
                                  socialLink.id,
                                  "url",
                                  event.target.value,
                                )
                              }
                              placeholder="linkedin.com/company/example"
                              sx={fieldSx}
                              value={socialLink.url}
                            />
                          </Grid>
                        </Grid>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </EditorSection>
            </TabPanel>

            <TabPanel index={4} value={activeTab}>
              <EditorSection
                description="Control the primary accent and the message around the main CTA."
                title="Brand settings"
              >
                <Grid columnSpacing={1.5} container rowSpacing={1.5}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      helperText="Used for CTA buttons and section accents."
                      label="Brand color"
                      onChange={handleFieldChange("brandColor")}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      sx={fieldSx}
                      type="color"
                      value={pageState.brandColor}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                      sx={{
                        ...surfaceSx,
                        alignItems: "center",
                        display: "flex",
                        gap: 1.5,
                        height: "100%",
                        p: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: pageState.brandColor,
                          height: 40,
                          width: 40,
                        }}
                      />
                      <Typography color="text.secondary" variant="body2">
                        Live accent preview for the public page.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      helperText="Label for the primary CTA shown in the hero block."
                      label="CTA label"
                      onChange={handleFieldChange("ctaLabel")}
                      sx={fieldSx}
                      value={pageState.ctaLabel}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      helperText="Short supporting note displayed next to the CTA."
                      label="CTA note"
                      onChange={handleFieldChange("ctaNote")}
                      sx={fieldSx}
                      value={pageState.ctaNote}
                    />
                  </Grid>
                </Grid>
              </EditorSection>

              <EditorSection
                description="This screen is intentionally frontend-only. Nothing is persisted, cached, or sent anywhere."
                title="Demo status"
              >
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 0,
                    boxShadow: "none",
                    "& .MuiAlert-message": {
                      width: "100%",
                    },
                  }}
                  variant="outlined"
                >
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontWeight: 600 }} variant="body2">
                      Local draft mode
                    </Typography>
                    <Typography variant="body2">
                      Use Preview to jump to the live page mockup, Reset to
                      clear the draft, and Publish demo to simulate a future
                      publish action without real API calls.
                    </Typography>
                  </Stack>
                </Alert>
              </EditorSection>
            </TabPanel>
          </Stack>
        </Paper>
      </Stack>

      <Stack ref={previewRef} spacing={2} sx={{ minWidth: 0 }}>
        <Paper sx={{ ...surfaceSx, p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={0.5}>
              <Typography sx={{ fontWeight: 600 }} variant="body1">
                Live preview
              </Typography>
              <Typography color="text.secondary" variant="body2">
                The preview refreshes immediately as the editor changes.
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Frontend-only demo state
            </Typography>
          </Stack>
        </Paper>

        <CompanyPagePreview data={pageState} />
      </Stack>

      <Snackbar
        autoHideDuration={3200}
        onClose={() =>
          setSnackbarState((currentState) => ({
            ...currentState,
            open: false,
          }))
        }
        open={snackbarState.open}
      >
        <Alert
          onClose={() =>
            setSnackbarState((currentState) => ({
              ...currentState,
              open: false,
            }))
          }
          severity={snackbarState.severity}
          sx={{
            borderRadius: 0,
            boxShadow: "none",
          }}
          variant="outlined"
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
