import type {
  Product as ApiProduct,
  ProductAttribute as ApiProductAttribute,
  ProductCharacteristic as ApiProductCharacteristic,
  ProductMutationBody,
} from "@/lib/api/types/product.types";

import type {
  ProductCharacteristic,
  ProductItem,
} from "./product.types";

function normalizeAttributeEntries(attributes: ApiProductAttribute[]) {
  return attributes
    .map((attribute) => ({
      key: attribute.key.trim(),
      value: attribute.value.trim(),
    }))
    .filter((attribute) => attribute.key.length > 0);
}

function normalizeCharacteristicEntries(
  characteristics: ApiProductCharacteristic[],
) {
  return characteristics
    .map((characteristic) => ({
      label: characteristic.label.trim(),
      value: characteristic.value.trim(),
    }))
    .filter((characteristic) => characteristic.label.length > 0);
}

function buildProductAttributesRecord(attributes: Array<{ key: string; value: string }>) {
  return attributes.reduce<Record<string, string>>((result, attribute) => {
    result[attribute.key] = attribute.value;
    return result;
  }, {});
}

function buildFallbackCharacteristics(
  productId: string,
  attributes: Array<{ key: string; value: string }>,
): ProductCharacteristic[] {
  return attributes.map((attribute, index) => ({
    id: `${productId}-attribute-${index + 1}`,
    label: attribute.key,
    value: attribute.value,
  }));
}

export function mapProductToProductItem(product: ApiProduct): ProductItem {
  const normalizedAttributes = normalizeAttributeEntries(product.attributes);
  const normalizedCharacteristics = normalizeCharacteristicEntries(
    product.characteristics,
  );
  const attributesRecord =
    normalizedAttributes.length > 0
      ? buildProductAttributesRecord(normalizedAttributes)
      : buildProductAttributesRecord(
          normalizedCharacteristics.map((characteristic) => ({
            key: characteristic.label,
            value: characteristic.value,
          })),
        );
  const characteristics =
    normalizedCharacteristics.length > 0
      ? normalizedCharacteristics.map((characteristic, index) => ({
          id:
            product.characteristics[index]?.id !== undefined &&
            product.characteristics[index]?.id !== null
              ? String(product.characteristics[index]?.id)
              : `${product.id}-characteristic-${index + 1}`,
          label: characteristic.label,
          value: characteristic.value,
        }))
      : buildFallbackCharacteristics(product.id, normalizedAttributes);

  return {
    attributes: attributesRecord,
    brand: product.brand,
    category: product.category,
    characteristics,
    createdAt: product.createdAt,
    currency: product.currency,
    description: product.description,
    dimensions: {
      height: product.height,
      length: product.length,
      weight: product.weight,
      width: product.width,
    },
    discount: product.discount,
    id: product.id,
    images: product.images
      .map((image) => image.url.trim())
      .filter((imageUrl) => imageUrl.length > 0),
    metrics: {
      orders: product.orders,
      rating: product.rating,
      revenue: product.revenue,
      views: product.views,
    },
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    seo: {
      description: product.seoDescription,
      title: product.seoTitle,
    },
    sku: product.sku,
    slug: product.slug,
    status: product.status,
    stock: product.stock,
    tags: product.tags,
    title: product.title,
    updatedAt: product.updatedAt,
  };
}

export function mapProductItemToProductMutationBody(
  product: ProductItem,
): ProductMutationBody {
  const attributes = Object.entries(product.attributes)
    .map(([key, value]) => ({
      key: key.trim(),
      value: value.trim(),
    }))
    .filter((attribute) => attribute.key.length > 0);
  const characteristics = product.characteristics
    .map((characteristic) => ({
      label: characteristic.label.trim(),
      value: characteristic.value.trim(),
    }))
    .filter((characteristic) => characteristic.label.length > 0);

  return {
    attributes,
    brand: product.brand.trim(),
    category: product.category.trim(),
    characteristics,
    compareAtPrice: product.compareAtPrice ?? null,
    currency: product.currency,
    description: product.description.trim(),
    discount: product.discount,
    height: product.dimensions.height.trim(),
    images: product.images
      .map((imageUrl, index) => ({
        sortOrder: index,
        url: imageUrl.trim(),
      }))
      .filter((image) => image.url.length > 0),
    length: product.dimensions.length.trim(),
    orders: product.metrics.orders,
    price: product.price,
    rating: product.metrics.rating,
    revenue: product.metrics.revenue,
    seoDescription: product.seo.description.trim(),
    seoTitle: product.seo.title.trim(),
    sku: product.sku.trim(),
    slug: product.slug.trim(),
    status: product.status,
    stock: product.stock,
    tags: product.tags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),
    title: product.title.trim(),
    views: product.metrics.views,
    weight: product.dimensions.weight.trim(),
    width: product.dimensions.width.trim(),
  };
}
