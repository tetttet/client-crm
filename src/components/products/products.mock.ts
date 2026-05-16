import { cloneProduct } from "./product-table.utils";
import type { ProductItem } from "./product.types";

function createProductImage(label: string, backgroundColor: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
      <rect width="640" height="640" fill="${backgroundColor}" />
      <rect x="72" y="48" width="496" height="544" fill="#ffffff" stroke="#d1d5db" stroke-width="8" />
      <rect x="184" y="112" width="272" height="368" rx="48" fill="#dbe4ea" stroke="#9ca3af" stroke-width="8" />
      <circle cx="320" cy="168" r="16" fill="#94a3b8" />
      <rect x="214" y="520" width="212" height="24" fill="#111827" opacity="0.12" />
      <text x="320" y="590" fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" text-anchor="middle">
        ${label}
      </text>
    </svg>
  `)}`;
}

function createCharacteristics(id: string, attributes: Record<string, string>) {
  return Object.entries(attributes).map(([label, value], index) => ({
    id: `${id}-char-${index + 1}`,
    label,
    value,
  }));
}

function createProduct(
  product: Omit<ProductItem, "characteristics">,
): ProductItem {
  return {
    ...product,
    characteristics: createCharacteristics(product.id, product.attributes),
  };
}

const productsMockSeed: ProductItem[] = [
  createProduct({
    id: "product-001",
    title: "Apple iPhone 15 Pro 256GB",
    slug: "apple-iphone-15-pro-256gb",
    description:
      "Flagship smartphone with a titanium frame, advanced camera system, and premium performance for the marketplace catalog.",
    sku: "APL-IP15P-256-NT",
    category: "Electronics / Smartphones",
    brand: "Apple",
    price: 1299,
    compareAtPrice: 1399,
    discount: 100,
    stock: 24,
    status: "active",
    createdAt: "2026-05-10",
    updatedAt: "2026-05-14",
    currency: "USD",
    tags: ["flagship", "apple", "smartphone", "premium"],
    dimensions: {
      weight: "0.19 kg",
      width: "70.6 mm",
      height: "146.6 mm",
      length: "8.3 mm",
    },
    seo: {
      title: "Apple iPhone 15 Pro 256GB | Premium Smartphone",
      description:
        "Explore the Apple iPhone 15 Pro with 256GB storage, titanium build, and pro-level camera performance.",
    },
    images: [
      createProductImage("Front", "#edf4ff"),
      createProductImage("Back", "#dcecff"),
      createProductImage("Camera", "#f4f8ff"),
    ],
    attributes: {
      Color: "Natural Titanium",
      Storage: "256 GB",
      Warranty: "12 months",
      Connectivity: "5G",
    },
    metrics: {
      orders: 86,
      rating: 4.9,
      revenue: 111714,
      views: 12400,
    },
  }),
  createProduct({
    id: "product-002",
    title: "Samsung Galaxy S25 Ultra 512GB",
    slug: "samsung-galaxy-s25-ultra-512gb",
    description:
      "Large-screen Android flagship tuned for content creators, mobile photography, and high-value bundle campaigns.",
    sku: "SMS-S25U-512-BK",
    category: "Electronics / Smartphones",
    brand: "Samsung",
    price: 1499,
    compareAtPrice: 1599,
    discount: 100,
    stock: 14,
    status: "active",
    createdAt: "2026-05-08",
    updatedAt: "2026-05-12",
    currency: "USD",
    tags: ["android", "camera", "s-pen", "premium"],
    dimensions: {
      weight: "0.23 kg",
      width: "79 mm",
      height: "162.3 mm",
      length: "8.6 mm",
    },
    seo: {
      title: "Samsung Galaxy S25 Ultra 512GB | Creator Flagship",
      description:
        "A premium Samsung flagship with a refined camera stack, S Pen support, and 512GB storage.",
    },
    images: [
      createProductImage("Front", "#eef2ff"),
      createProductImage("Back", "#dde7ff"),
      createProductImage("Bundle", "#f5f7ff"),
    ],
    attributes: {
      Color: "Phantom Black",
      Storage: "512 GB",
      Display: "6.9 AMOLED",
      Battery: "5000 mAh",
    },
    metrics: {
      orders: 64,
      rating: 4.8,
      revenue: 95936,
      views: 10120,
    },
  }),
  createProduct({
    id: "product-003",
    title: "Dyson V12 Detect Slim",
    slug: "dyson-v12-detect-slim",
    description:
      "Lightweight cordless vacuum with laser dust reveal and premium attachments, positioned for higher-margin home sales.",
    sku: "DYS-V12-SLIM-GLD",
    category: "Home / Appliances",
    brand: "Dyson",
    price: 699,
    compareAtPrice: 799,
    discount: 100,
    stock: 6,
    status: "draft",
    createdAt: "2026-05-02",
    updatedAt: "2026-05-11",
    currency: "USD",
    tags: ["home", "vacuum", "premium", "wireless"],
    dimensions: {
      weight: "2.2 kg",
      width: "25 cm",
      height: "123 cm",
      length: "25 cm",
    },
    seo: {
      title: "Dyson V12 Detect Slim | Cordless Vacuum",
      description:
        "Premium cordless vacuum with laser dust detection, slim body, and versatile cleaning tools.",
    },
    images: [
      createProductImage("Kit", "#fff6eb"),
      createProductImage("Laser", "#ffe7c2"),
      createProductImage("Dock", "#fffaf2"),
    ],
    attributes: {
      Color: "Gold / Nickel",
      Runtime: "60 min",
      DustBin: "0.35 L",
      Warranty: "24 months",
    },
    metrics: {
      orders: 18,
      rating: 4.7,
      revenue: 12582,
      views: 2840,
    },
  }),
  createProduct({
    id: "product-004",
    title: "Nike Air Zoom Pegasus 41",
    slug: "nike-air-zoom-pegasus-41",
    description:
      "Reliable daily running shoes with a mass-market fit, good repeat purchase behavior, and seasonal promo potential.",
    sku: "NIK-PEG41-WHT",
    category: "Fashion / Sneakers",
    brand: "Nike",
    price: 145,
    compareAtPrice: 175,
    discount: 30,
    stock: 58,
    status: "active",
    createdAt: "2026-04-27",
    updatedAt: "2026-05-15",
    currency: "USD",
    tags: ["running", "sneakers", "men", "bestseller"],
    dimensions: {
      weight: "0.62 kg",
      width: "18 cm",
      height: "12 cm",
      length: "34 cm",
    },
    seo: {
      title: "Nike Air Zoom Pegasus 41 | Daily Running Shoes",
      description:
        "The latest Pegasus silhouette with responsive cushioning for everyday mileage and training.",
    },
    images: [
      createProductImage("Pair", "#f3f7ff"),
      createProductImage("Sole", "#e3ecff"),
      createProductImage("Angle", "#f7faff"),
    ],
    attributes: {
      Color: "White / Blue",
      Material: "Mesh",
      Gender: "Men",
      SizeRange: "40-46",
    },
    metrics: {
      orders: 193,
      rating: 4.8,
      revenue: 27985,
      views: 21940,
    },
  }),
  createProduct({
    id: "product-005",
    title: "Logitech MX Master 3S",
    slug: "logitech-mx-master-3s",
    description:
      "A high-converting productivity mouse for office bundles and tech accessories, currently awaiting replenishment.",
    sku: "LOG-MX3S-GR",
    category: "Electronics / Accessories",
    brand: "Logitech",
    price: 119,
    compareAtPrice: 149,
    discount: 30,
    stock: 0,
    status: "active",
    createdAt: "2026-04-18",
    updatedAt: "2026-05-09",
    currency: "USD",
    tags: ["office", "mouse", "wireless", "creator"],
    dimensions: {
      weight: "0.14 kg",
      width: "8.4 cm",
      height: "12.4 cm",
      length: "5.1 cm",
    },
    seo: {
      title: "Logitech MX Master 3S | Productivity Mouse",
      description:
        "Wireless productivity mouse with quiet clicks, precision scrolling, and multi-device pairing.",
    },
    images: [
      createProductImage("Top", "#edf2f7"),
      createProductImage("Side", "#dde5ee"),
      createProductImage("Scroll", "#f8fbff"),
    ],
    attributes: {
      Color: "Graphite",
      Connectivity: "Bluetooth / USB",
      DPI: "8000",
      Battery: "70 days",
    },
    metrics: {
      orders: 71,
      rating: 4.9,
      revenue: 8449,
      views: 6340,
    },
  }),
  createProduct({
    id: "product-006",
    title: "Xiaomi Smart Band 9",
    slug: "xiaomi-smart-band-9",
    description:
      "Accessible wearable with strong volume potential and efficient ad spend for entry-level electronics campaigns.",
    sku: "XMI-BAND9-BLK",
    category: "Electronics / Wearables",
    brand: "Xiaomi",
    price: 1699,
    compareAtPrice: 1999,
    discount: 300,
    stock: 132,
    status: "draft",
    createdAt: "2026-05-04",
    updatedAt: "2026-05-15",
    currency: "TRY",
    tags: ["fitness", "wearable", "budget", "smart-band"],
    dimensions: {
      weight: "0.03 kg",
      width: "2.2 cm",
      height: "4.6 cm",
      length: "1.1 cm",
    },
    seo: {
      title: "Xiaomi Smart Band 9 | Fitness Tracker",
      description:
        "Slim fitness tracker with a bright AMOLED display, long battery life, and broad everyday appeal.",
    },
    images: [
      createProductImage("Band", "#eef8ff"),
      createProductImage("Display", "#d8edff"),
      createProductImage("Box", "#f6fbff"),
    ],
    attributes: {
      Color: "Black",
      Display: "AMOLED",
      WaterResistance: "5 ATM",
      Battery: "21 days",
    },
    metrics: {
      orders: 144,
      rating: 4.6,
      revenue: 244656,
      views: 19620,
    },
  }),
  createProduct({
    id: "product-007",
    title: "Philips 27E1N1800A 4K Monitor",
    slug: "philips-27e1n1800a-4k-monitor",
    description:
      "Reliable 27-inch 4K monitor for office and creator setups, held in archived state while the assortment is refreshed.",
    sku: "PHL-27E1N1800A",
    category: "Electronics / Monitors",
    brand: "Philips",
    price: 329,
    compareAtPrice: 379,
    discount: 50,
    stock: 7,
    status: "archived",
    createdAt: "2026-03-29",
    updatedAt: "2026-05-01",
    currency: "EUR",
    tags: ["monitor", "4k", "office", "display"],
    dimensions: {
      weight: "4.3 kg",
      width: "61.3 cm",
      height: "45.6 cm",
      length: "21.1 cm",
    },
    seo: {
      title: "Philips 27E1N1800A | 27-inch 4K Monitor",
      description:
        "A clean 4K desktop monitor for office and creative use with strong sharpness and balanced pricing.",
    },
    images: [
      createProductImage("Front", "#edf6ff"),
      createProductImage("Rear", "#deecff"),
      createProductImage("Desk", "#f7fbff"),
    ],
    attributes: {
      Resolution: "3840 x 2160",
      Panel: "IPS",
      RefreshRate: "60 Hz",
      Ports: "HDMI / DisplayPort",
    },
    metrics: {
      orders: 23,
      rating: 4.5,
      revenue: 7567,
      views: 2980,
    },
  }),
  createProduct({
    id: "product-008",
    title: "Stanley Quencher H2.0 1.18L",
    slug: "stanley-quencher-h2o-118l",
    description:
      "A high-visibility lifestyle tumbler that performs well in bundles, gifts, and impulse-focused social campaigns.",
    sku: "STN-Q118-BLU",
    category: "Home / Drinkware",
    brand: "Stanley",
    price: 2190,
    compareAtPrice: 2590,
    discount: 400,
    stock: 19,
    status: "active",
    createdAt: "2026-05-12",
    updatedAt: "2026-05-16",
    currency: "TRY",
    tags: ["drinkware", "lifestyle", "gift", "bestseller"],
    dimensions: {
      weight: "0.63 kg",
      width: "10 cm",
      height: "31 cm",
      length: "10 cm",
    },
    seo: {
      title: "Stanley Quencher H2.0 1.18L | Lifestyle Tumbler",
      description:
        "Large insulated tumbler with strong gifting appeal, a handle, and all-day cold retention.",
    },
    images: [
      createProductImage("Cup", "#f2f8ff"),
      createProductImage("Handle", "#deedff"),
      createProductImage("Lid", "#f8fbff"),
    ],
    attributes: {
      Color: "Coastal Blue",
      Capacity: "1.18 L",
      Material: "Stainless Steel",
      Insulation: "Double wall",
    },
    metrics: {
      orders: 91,
      rating: 4.8,
      revenue: 199290,
      views: 14570,
    },
  }),
];

export function createProductsMock() {
  return productsMockSeed.map(cloneProduct);
}
