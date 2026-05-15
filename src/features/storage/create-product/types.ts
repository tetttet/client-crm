export type ProductStatus = "draft" | "active" | "archived";
export type ProductCurrency =
  | "USD"
  | "EUR"
  | "GBP"
  | "TRY"
  | "KZT"
  | "RUB"
  | "AED"
  | "CNY";

export type ProductAttribute = {
  id: string;
  key: string;
  value: string;
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
  dimensions: {
    weight: string;
    width: string;
    height: string;
    length: string;
  };
  seo: {
    title: string;
    description: string;
  };
  images: {
    mainImage: File | null;
    gallery: File[];
  };
  attributes: Record<string, string>;
};
