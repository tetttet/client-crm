import ProductTable from "@/components/products/ProductTable";
import Box from "@mui/material/Box";

export default function ListProductsRoute() {
  return (
    <Box sx={{ minWidth: 0, minHeight: 0, flex: "0 0 auto" }}>
      <ProductTable />
    </Box>
  );
}
