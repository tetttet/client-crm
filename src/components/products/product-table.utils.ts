import type {
  ProductCharacteristic,
  ProductCurrency,
  ProductItem,
  ProductPriceFilter,
  ProductSortBy,
  ProductStatus,
  ProductStockFilter,
  ProductTableFilters,
} from "./product.types";

type ProductStatusMeta = {
  backgroundColor: string;
  borderColor: string;
  color: string;
  label: string;
};

type ProductStockMeta = {
  backgroundColor: string;
  borderColor: string;
  color: string;
  label: string;
};

export const DEFAULT_PRODUCT_TABLE_FILTERS: ProductTableFilters = {
  brand: "all",
  category: "all",
  price: "all",
  search: "",
  sortBy: "newest",
  status: "all",
  stock: "all",
};

export const productStatusOptions: Array<{
  label: string;
  value: ProductStatus;
}> = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export const productStockFilterOptions: Array<{
  label: string;
  value: ProductStockFilter;
}> = [
  { value: "all", label: "All stock" },
  { value: "in-stock", label: "In stock" },
  { value: "low-stock", label: "Low stock" },
  { value: "out-of-stock", label: "Out of stock" },
];

export const productPriceFilterOptions: Array<{
  label: string;
  value: ProductPriceFilter;
}> = [
  { value: "all", label: "All prices" },
  { value: "under-100", label: "Under 100" },
  { value: "100-500", label: "100 - 500" },
  { value: "500-1000", label: "500 - 1000" },
  { value: "1000-plus", label: "1000+" },
];

export const productSortOptions: Array<{
  label: string;
  value: ProductSortBy;
}> = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "stock-desc", label: "Stock: high to low" },
  { value: "views-desc", label: "Views: high to low" },
];

const productStatusMeta: Record<ProductStatus, ProductStatusMeta> = {
  active: {
    label: "Active",
    color: "#1565c0",
    backgroundColor: "#e3f2fd",
    borderColor: "#90caf9",
  },
  draft: {
    label: "Draft",
    color: "#8a5b00",
    backgroundColor: "#fff8e5",
    borderColor: "#f5d998",
  },
  archived: {
    label: "Archived",
    color: "#52606d",
    backgroundColor: "#f5f7fa",
    borderColor: "#d8e0e8",
  },
};

const productStockMeta: Record<
  Exclude<ProductStockFilter, "all">,
  ProductStockMeta
> = {
  "in-stock": {
    label: "In stock",
    color: "#0b6b3a",
    backgroundColor: "#edf9f1",
    borderColor: "#b7e4c7",
  },
  "low-stock": {
    label: "Low",
    color: "#975a16",
    backgroundColor: "#fff6e8",
    borderColor: "#f7cf8d",
  },
  "out-of-stock": {
    label: "Out",
    color: "#9b1c1c",
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
  },
};

function matchesPriceFilter(price: number, filter: ProductPriceFilter) {
  switch (filter) {
    case "under-100":
      return price < 100;
    case "100-500":
      return price >= 100 && price < 500;
    case "500-1000":
      return price >= 500 && price < 1000;
    case "1000-plus":
      return price >= 1000;
    case "all":
    default:
      return true;
  }
}

function sortProducts(products: ProductItem[], sortBy: ProductSortBy) {
  const nextProducts = [...products];

  nextProducts.sort((leftProduct, rightProduct) => {
    switch (sortBy) {
      case "oldest":
        return (
          new Date(leftProduct.createdAt).getTime() -
          new Date(rightProduct.createdAt).getTime()
        );
      case "price-asc":
        return leftProduct.price - rightProduct.price;
      case "price-desc":
        return rightProduct.price - leftProduct.price;
      case "stock-desc":
        return rightProduct.stock - leftProduct.stock;
      case "views-desc":
        return rightProduct.metrics.views - leftProduct.metrics.views;
      case "newest":
      default:
        return (
          new Date(rightProduct.createdAt).getTime() -
          new Date(leftProduct.createdAt).getTime()
        );
    }
  });

  return nextProducts;
}

function getOptionLabel<Value extends string>(
  options: Array<{ label: string; value: Value }>,
  value: Value,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function getProductStatusFilterLabel(value: ProductStatus | "all") {
  if (value === "all") {
    return "All";
  }

  return getOptionLabel(productStatusOptions, value);
}

export function getProductStockFilterLabel(value: ProductStockFilter) {
  return getOptionLabel(productStockFilterOptions, value);
}

export function getProductPriceFilterLabel(value: ProductPriceFilter) {
  return getOptionLabel(productPriceFilterOptions, value);
}

export function getProductSortLabel(value: ProductSortBy) {
  return getOptionLabel(productSortOptions, value);
}

export function getProductTableSummaryItems(filters: ProductTableFilters) {
  const summary: string[] = [];

  if (filters.search.trim()) {
    summary.push(`Search: ${filters.search.trim()}`);
  }

  if (filters.status !== "all") {
    summary.push(`Status: ${getProductStatusFilterLabel(filters.status)}`);
  }

  if (filters.category !== "all") {
    summary.push(`Category: ${filters.category}`);
  }

  if (filters.brand !== "all") {
    summary.push(`Brand: ${filters.brand}`);
  }

  if (filters.stock !== "all") {
    summary.push(`Stock: ${getProductStockFilterLabel(filters.stock)}`);
  }

  if (filters.price !== "all") {
    summary.push(`Price: ${getProductPriceFilterLabel(filters.price)}`);
  }

  return summary;
}

export function buildProductAttributesRecord(
  characteristics: ProductCharacteristic[],
) {
  return characteristics.reduce<Record<string, string>>((result, characteristic) => {
    const key = characteristic.label.trim();

    if (!key) {
      return result;
    }

    result[key] = characteristic.value.trim();
    return result;
  }, {});
}

export function cloneProduct(product: ProductItem): ProductItem {
  return {
    ...product,
    images: [...product.images],
    tags: [...product.tags],
    dimensions: {
      ...product.dimensions,
    },
    seo: {
      ...product.seo,
    },
    attributes: {
      ...product.attributes,
    },
    metrics: {
      ...product.metrics,
    },
    characteristics: product.characteristics.map((characteristic) => ({
      ...characteristic,
    })),
  };
}

export function filterProducts(products: ProductItem[], filters: ProductTableFilters) {
  const searchValue = filters.search.trim().toLowerCase();

  const nextProducts = products.filter((product) => {
    if (filters.status !== "all" && product.status !== filters.status) {
      return false;
    }

    if (filters.category !== "all" && product.category !== filters.category) {
      return false;
    }

    if (filters.brand !== "all" && product.brand !== filters.brand) {
      return false;
    }

    if (
      filters.stock !== "all" &&
      getProductStockFilterValue(product) !== filters.stock
    ) {
      return false;
    }

    if (!matchesPriceFilter(product.price, filters.price)) {
      return false;
    }

    if (!searchValue) {
      return true;
    }

    const searchableValue = [
      product.title,
      product.brand,
      product.category,
      product.sku,
      product.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return searchableValue.includes(searchValue);
  });

  return sortProducts(nextProducts, filters.sortBy);
}

export function formatProductCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

export function formatProductDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatProductPrice(value: number, currency: ProductCurrency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getProductDiscountPercent(product: ProductItem) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return 0;
  }

  return Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
  );
}

export function getProductStatusMeta(status: ProductStatus) {
  return productStatusMeta[status];
}

export function getProductStockFilterValue(product: ProductItem): Exclude<
  ProductStockFilter,
  "all"
> {
  if (product.stock <= 0) {
    return "out-of-stock";
  }

  if (product.stock <= 10) {
    return "low-stock";
  }

  return "in-stock";
}

export function getProductStockMeta(product: ProductItem) {
  return productStockMeta[getProductStockFilterValue(product)];
}

export function getProductTableSummary(filters: ProductTableFilters) {
  const filterSummary = getProductTableSummaryItems(filters);

  if (filterSummary.length === 0) {
    return "All products";
  }

  return filterSummary.join(" • ");
}
