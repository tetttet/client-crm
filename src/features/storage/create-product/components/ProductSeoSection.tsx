import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { fieldSx, sectionCardSx } from "../lib/styles";

type ProductSeoSectionProps = Readonly<{
  description: string;
  onDescriptionChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  slug: string;
  title: string;
}>;

export function ProductSeoSection({
  description,
  onDescriptionChange,
  onTitleChange,
  slug,
  title,
}: ProductSeoSectionProps) {
  const resolvedTitle = title.trim() || "Product title for search results";
  const resolvedDescription =
    description.trim() ||
    "A short search snippet will appear here once the SEO description is added.";

  return (
    <Paper sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Typography sx={{ fontWeight: 600 }} variant="body1">
            SEO
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Prepare metadata for search engines and marketplace discovery.
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Slug"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={fieldSx}
            value={slug}
          />
          <TextField
            fullWidth
            label="SEO title"
            onChange={(event) => onTitleChange(event.target.value)}
            sx={fieldSx}
            value={title}
          />
          <TextField
            fullWidth
            label="SEO description"
            minRows={4}
            multiline
            onChange={(event) => onDescriptionChange(event.target.value)}
            sx={fieldSx}
            value={description}
          />

          <Box
            sx={{
              bgcolor: "#fbfcfe",
              border: "1px solid #e0e0e0",
              borderRadius: "2px",
              p: 2,
            }}
          >
            <Stack spacing={0.5}>
              <Typography color="text.secondary" variant="caption">
                Search preview
              </Typography>
              <Typography
                sx={{
                  color: "#1a0dab",
                  fontSize: "1rem",
                  lineHeight: 1.35,
                  wordBreak: "break-word",
                }}
                variant="body2"
              >
                {resolvedTitle}
              </Typography>
              <Typography color="#188038" variant="caption">
                example.com/products/{slug}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {resolvedDescription}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
