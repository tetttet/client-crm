export type ProductStatus = "draft" | "active" | "archived";

export type ProductCurrency = string;

export type ProductCharacteristic = {
  id: string;
  label: string;
  value: string;
};

export type ProductAttribute = {
  id: string;
  key: string;
  value: string;
};

export type ProductDimensions = {
  weight: string;
  width: string;
  height: string;
  length: string;
};

export type ProductSeo = {
  title: string;
  description: string;
};

export type ProductImagePreview = {
  id: string;
  file: File;
  previewUrl: string;
};

export type ProductFormValues = {
  title: string;
  description: string;
  currency: ProductCurrency;
  price: string;
  compareAtPrice: string;
  sku: string;
  stock: string;
  category: string;
  status: ProductStatus;
  brand: string;
  weight: string;
  width: string;
  height: string;
  length: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  attributes: ProductAttribute[];
  mainImage: ProductImagePreview | null;
  galleryImages: ProductImagePreview[];
};

export type ProductPayload = {
  title: string;
  description: string;
  slug: string;
  currency: ProductCurrency;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  category: string;
  status: ProductStatus;
  brand: string;
  tags: string[];
  dimensions: ProductDimensions;
  seo: ProductSeo;
  images: {
    mainImage: File | null;
    gallery: File[];
  };
  attributes: Record<string, string>;
};

export type ProductCatalogMetrics = {
  orders: number;
  rating: number;
  revenue: number;
  views: number;
};

export type ProductItem = Omit<ProductPayload, "images"> & {
  id: string;
  createdAt: string;
  discount: number;
  images: string[];
  characteristics: ProductCharacteristic[];
  metrics: ProductCatalogMetrics;
  updatedAt: string;
};

export type ProductStockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";

export type ProductPriceFilter =
  | "all"
  | "under-100"
  | "100-500"
  | "500-1000"
  | "1000-plus";

export type ProductSortBy =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "stock-desc"
  | "views-desc";

export type ProductStatusFilter = ProductStatus | "all";

export type ProductTableFilters = {
  brand: string;
  category: string;
  price: ProductPriceFilter;
  search: string;
  sortBy: ProductSortBy;
  status: ProductStatusFilter;
  stock: ProductStockFilter;
};
