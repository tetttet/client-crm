import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateProductBody,
  ProductResponse,
  ProductsQuery,
  ProductsResponse,
  UpdateProductBody,
} from "@/lib/api/types/product.types";

export function getProducts(query?: ProductsQuery) {
  return apiClient.get<ProductsResponse>(API_ENDPOINTS.products.root, {
    query,
  });
}

export function getProductById(id: string) {
  return apiClient.get<ProductResponse>(API_ENDPOINTS.products.byId(id));
}

export function getProductBySlug(slug: string) {
  return apiClient.get<ProductResponse>(API_ENDPOINTS.products.bySlug(slug));
}

export function createProduct(body: CreateProductBody) {
  return apiClient.post<ProductResponse, CreateProductBody>(
    API_ENDPOINTS.products.root,
    {
      body,
    },
  );
}

export function updateProduct(id: string, body: UpdateProductBody) {
  return apiClient.patch<ProductResponse, UpdateProductBody>(
    API_ENDPOINTS.products.byId(id),
    {
      body,
    },
  );
}

export function deleteProduct(id: string) {
  return apiClient.delete(API_ENDPOINTS.products.byId(id));
}
