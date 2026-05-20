import type {
  ApiSuccess,
  EntityData,
  PaginatedData,
  PaginationQuery,
} from "./api.types";

export type ProductStatus = "active" | "archived" | "draft";

export type ProductQuerySortOrder = "asc" | "desc";

export type ProductImage = {
  alt?: string | null;
  id?: number | string;
  sortOrder?: number;
  url: string;
};

export type ProductAttribute = {
  id?: number | string;
  key: string;
  value: string;
};

export type ProductCharacteristic = {
  id?: number | string;
  label: string;
  value: string;
};

export type Product = {
  attributes: ProductAttribute[];
  brand: string;
  category: string;
  characteristics: ProductCharacteristic[];
  companyId: string;
  compareAtPrice: number | null;
  createdAt: string;
  createdByEmployeeId: number | null;
  currency: string;
  description: string;
  discount: number;
  height: string;
  id: string;
  images: ProductImage[];
  length: string;
  orders: number;
  price: number;
  rating: number;
  revenue: number;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  slug: string;
  status: ProductStatus;
  stock: number;
  tags: string[];
  title: string;
  updatedAt: string;
  updatedByEmployeeId: number | null;
  views: number;
  weight: string;
  width: string;
};

export type ProductsQuery = PaginationQuery & {
  brand?: string;
  category?: string;
  currency?: string;
  inStock?: boolean;
  maxPrice?: number;
  minPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: ProductQuerySortOrder;
  status?: ProductStatus;
  tag?: string;
};

export type ProductMutationBody = {
  attributes?: ProductAttribute[];
  brand?: string;
  category: string;
  characteristics?: ProductCharacteristic[];
  compareAtPrice?: number | null;
  currency?: string;
  description?: string;
  discount?: number;
  height?: string;
  images?: ProductImage[];
  length?: string;
  orders?: number;
  price: number;
  rating?: number;
  revenue?: number;
  seoDescription?: string;
  seoTitle?: string;
  sku: string;
  slug: string;
  status?: ProductStatus;
  stock?: number;
  tags?: string[];
  title: string;
  views?: number;
  weight?: string;
  width?: string;
};

export type CreateProductBody = ProductMutationBody;

export type UpdateProductBody = Partial<ProductMutationBody>;

export type ProductResponse = ApiSuccess<EntityData<"product", Product>>;

export type ProductsResponse = ApiSuccess<PaginatedData<"products", Product>>;
