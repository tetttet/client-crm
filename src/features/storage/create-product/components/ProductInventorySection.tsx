import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { fieldSx, sectionCardSx } from "../lib/styles";

type ProductInventorySectionProps = Readonly<{
  height: string;
  length: string;
  onHeightChange: (value: string) => void;
  onLengthChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  onStockChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onWidthChange: (value: string) => void;
  sku: string;
  stock: string;
  weight: string;
  width: string;
}>;

export function ProductInventorySection({
  height,
  length,
  onHeightChange,
  onLengthChange,
  onSkuChange,
  onStockChange,
  onWeightChange,
  onWidthChange,
  sku,
  stock,
  weight,
  width,
}: ProductInventorySectionProps) {
  return (
    <Paper sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Typography sx={{ fontWeight: 600 }} variant="body1">
            Inventory & shipping
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Track stock, internal references, and physical dimensions.
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="SKU"
            onChange={(event) => onSkuChange(event.target.value)}
            required
            sx={fieldSx}
            value={sku}
          />
          <TextField
            fullWidth
            label="Quantity in stock"
            onChange={(event) => onStockChange(event.target.value)}
            required
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },
            }}
            sx={fieldSx}
            type="number"
            value={stock}
          />

          <Grid columnSpacing={1.5} container rowSpacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Weight"
                onChange={(event) => onWeightChange(event.target.value)}
                placeholder="0.55 kg"
                sx={fieldSx}
                value={weight}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Width"
                onChange={(event) => onWidthChange(event.target.value)}
                placeholder="24 cm"
                sx={fieldSx}
                value={width}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Height"
                onChange={(event) => onHeightChange(event.target.value)}
                placeholder="12 cm"
                sx={fieldSx}
                value={height}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Length"
                onChange={(event) => onLengthChange(event.target.value)}
                placeholder="35 cm"
                sx={fieldSx}
                value={length}
              />
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Paper>
  );
}
