import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {
  buttonSx,
  chipSx,
  fieldSx,
  iconButtonSx,
  sectionCardSx,
} from "../lib/styles";
import { presetAttributes } from "../lib/product-options";
import type { ProductAttribute } from "../types";

type ProductAttributesEditorProps = Readonly<{
  attributes: ProductAttribute[];
  onAddAttribute: () => void;
  onAddPresetAttribute: (key: string) => void;
  onAttributeChange: (
    attributeId: string,
    field: "key" | "value",
    value: string,
  ) => void;
  onRemoveAttribute: (attributeId: string) => void;
}>;

export function ProductAttributesEditor({
  attributes,
  onAddAttribute,
  onAddPresetAttribute,
  onAttributeChange,
  onRemoveAttribute,
}: ProductAttributesEditorProps) {
  return (
    <Paper sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Typography sx={{ fontWeight: 600 }} variant="body1">
            Attributes
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Create flexible key and value pairs that can later be stored as a
            JSONB object.
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
              Quick add
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {presetAttributes.map((preset) => {
                const alreadyExists = attributes.some(
                  (attribute) =>
                    attribute.key.trim().toLowerCase() === preset.toLowerCase(),
                );

                return (
                  <Chip
                    clickable={!alreadyExists}
                    key={preset}
                    label={preset}
                    onClick={() => onAddPresetAttribute(preset)}
                    sx={{
                      ...chipSx,
                      bgcolor: alreadyExists ? "#eef4ff" : "#ffffff",
                      border: "1px solid #d6dee8",
                      color: alreadyExists ? "#1a73e8" : "text.primary",
                    }}
                    variant="outlined"
                  />
                );
              })}
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
                Custom attributes
              </Typography>
              <Button
                disableElevation
                onClick={onAddAttribute}
                startIcon={<AddOutlinedIcon fontSize="small" />}
                sx={buttonSx}
                variant="outlined"
              >
                Add attribute
              </Button>
            </Stack>

            {attributes.length > 0 ? (
              <Stack spacing={1.5}>
                {attributes.map((attribute) => (
                  <Stack
                    key={attribute.id}
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.25}
                    sx={{ alignItems: { xs: "stretch", md: "center" } }}
                  >
                    <TextField
                      fullWidth
                      label="Attribute"
                      onChange={(event) =>
                        onAttributeChange(attribute.id, "key", event.target.value)
                      }
                      placeholder="Color"
                      sx={fieldSx}
                      value={attribute.key}
                    />
                    <TextField
                      fullWidth
                      label="Value"
                      onChange={(event) =>
                        onAttributeChange(
                          attribute.id,
                          "value",
                          event.target.value,
                        )
                      }
                      placeholder="Black"
                      sx={fieldSx}
                      value={attribute.value}
                    />
                    <IconButton
                      aria-label="Remove attribute"
                      onClick={() => onRemoveAttribute(attribute.id)}
                      size="small"
                      sx={{
                        ...iconButtonSx,
                        alignSelf: { xs: "flex-end", md: "center" },
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  border: "1px dashed #c8d1dc",
                  borderRadius: "2px",
                  p: 2.5,
                }}
              >
                <Typography color="text.secondary" variant="body2">
                  No attributes added yet. Start with a preset or create custom
                  pairs for product-specific details.
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
