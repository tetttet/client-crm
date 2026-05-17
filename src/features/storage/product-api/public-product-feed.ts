import { createProductsMock } from "@/components/products/products.mock";

import type { PublicProductApiItem } from "./product-api.types";

function buildPublicProductItem(product: ReturnType<typeof createProductsMock>[number]): PublicProductApiItem {
  return {
    attributes: {
      ...product.attributes,
    },
    brand: product.brand,
    category: product.category,
    compareAtPrice: product.compareAtPrice,
    currency: product.currency,
    description: product.description,
    id: product.id,
    image: product.images[0] ?? null,
    price: product.price,
    sku: product.sku,
    slug: product.slug,
    stock: product.stock,
    tags: [...product.tags],
    title: product.title,
    updatedAt: product.updatedAt,
  };
}

export function getPublicProductFeed() {
  const products = createProductsMock()
    .filter((product) => product.status === "active")
    .map(buildPublicProductItem);

  return {
    generatedAt: new Date().toISOString(),
    products,
    total: products.length,
  };
}
