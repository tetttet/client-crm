"use client";

import { useCallback, useEffect, useState } from "react";

import { toApiError, type ApiError } from "@/lib/api/api-error";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "@/lib/api/services/products.service";
import type {
  CreateProductBody,
  Product,
  ProductsQuery,
  UpdateProductBody,
} from "@/lib/api/types/product.types";

import { useAuthSession } from "./use-auth-session";

type UseProductsOptions = {
  autoLoad?: boolean;
  enabled?: boolean;
  initialQuery?: ProductsQuery;
};

const PRODUCTS_MAX_LIMIT = 100;

function normalizeProductsQuery(query: ProductsQuery): ProductsQuery {
  if (typeof query.limit !== "number" || !Number.isFinite(query.limit)) {
    return query;
  }

  return {
    ...query,
    limit: Math.min(PRODUCTS_MAX_LIMIT, Math.max(1, Math.trunc(query.limit))),
  };
}

export function useProducts(options: UseProductsOptions = {}) {
  const { autoLoad = true, enabled = true, initialQuery = {} } = options;
  const session = useAuthSession();
  const [productsState, setProductsState] = useState<Product[]>([]);
  const [errorState, setErrorState] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [query, setQuery] = useState<ProductsQuery>(
    normalizeProductsQuery(initialQuery),
  );
  const [totalState, setTotalState] = useState(0);

  const refetch = useCallback(async (overrideQuery?: ProductsQuery) => {
    if (!session.accessToken) {
      return null;
    }

    const nextQuery = normalizeProductsQuery({
      ...query,
      ...overrideQuery,
    });

    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await getProducts(nextQuery);
      setProductsState(response.products);
      setTotalState(response.total);
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Failed to load products.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [query, session.accessToken]);

  useEffect(() => {
    if (!enabled || !autoLoad || !session.accessToken) {
      return;
    }

    void (async () => {
      try {
        await refetch();
      } catch {
        return;
      }
    })();
  }, [autoLoad, enabled, refetch, session.accessToken]);

  async function runMutation<TResponse>(request: Promise<TResponse>) {
    setIsMutating(true);
    setErrorState(null);

    try {
      const response = await request;
      await refetch();
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Product request failed.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  const hasSession = Boolean(session.accessToken);

  return {
    createProduct: (body: CreateProductBody) =>
      runMutation(createProduct(body)),
    deleteProduct: (id: string) => runMutation(deleteProduct(id)),
    error: hasSession ? errorState : null,
    getProductById,
    getProductBySlug,
    isLoading: hasSession ? isLoading : false,
    isMutating,
    products: hasSession ? productsState : [],
    query,
    refetch,
    setQuery,
    total: hasSession ? totalState : 0,
    updateProduct: (id: string, body: UpdateProductBody) =>
      runMutation(updateProduct(id, body)),
  };
}
