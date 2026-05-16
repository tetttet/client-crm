
import Box from "@mui/material/Box";

import ProductTable from "@/components/products/ProductTable";

const products = [
  {
    generalInformation: "Premium Desk",
    media: "Photo + video",
    mainPhoto: "Desk Lamp Pro",
    gallery: "8 photos",
    attributes: "Oak / 120 cm",
    seo: "Office desk",
    status: "Active",
    pricing: "$249",
    inventoryShipping: 34,
    organization: "Featured",
  },
  {
    generalInformation: "Wireless Mouse",
    media: "Photo",
    mainPhoto: "Ergo Mouse",
    gallery: "5 photos",
    attributes: "Black / Wireless",
    seo: "Computer mouse",
    status: "Active",
    pricing: "$59",
    inventoryShipping: 41,
    organization: "Standard",
  },
  {
    generalInformation: "Monitor Stand",
    media: "Photo",
    mainPhoto: "Aluminum Stand",
    gallery: "6 photos",
    attributes: "Silver / Metal",
    seo: "Monitor stand",
    status: "Active",
    pricing: "$79",
    inventoryShipping: 29,
    organization: "Featured",
  },
  {
    generalInformation: "Keyboard",
    media: "Photo + video",
    mainPhoto: "Mechanical Keyboard",
    gallery: "7 photos",
    attributes: "White / Blue switch",
    seo: "Mechanical keyboard",
    status: "Draft",
    pricing: "$119",
    inventoryShipping: 27,
    organization: "Standard",
  },
  {
    generalInformation: "Office Chair",
    media: "Photo",
    mainPhoto: "Ergonomic Chair",
    gallery: "9 photos",
    attributes: "Gray / Fabric",
    seo: "Office chair",
    status: "Active",
    pricing: "$189",
    inventoryShipping: 32,
    organization: "Featured",
  },
  {
    generalInformation: "Docking Station",
    media: "Photo",
    mainPhoto: "USB-C Dock",
    gallery: "4 photos",
    attributes: "USB-C / 8 ports",
    seo: "Docking station",
    status: "Active",
    pricing: "$139",
    inventoryShipping: 36,
    organization: "Standard",
  },
  {
    generalInformation: "Notebook",
    media: "Photo",
    mainPhoto: "Planning Notebook",
    gallery: "3 photos",
    attributes: "A5 / 160 pages",
    seo: "Planning notebook",
    status: "Active",
    pricing: "$18",
    inventoryShipping: 30,
    organization: "Featured",
  },
  {
    generalInformation: "Headset",
    media: "Photo + video",
    mainPhoto: "Support Headset",
    gallery: "6 photos",
    attributes: "Black / Noise cancel",
    seo: "Support headset",
    status: "Draft",
    pricing: "$89",
    inventoryShipping: 39,
    organization: "Standard",
  },
];

export default function ListProductsRoute() {
  return (
    <Box sx={{ minWidth: 0, minHeight: 0, flex: "0 0 auto" }}>
      <ProductTable products={products} fillHeight={false} viewportHeight={520} />
    </Box>
  );
}

