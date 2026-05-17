export type ProductApiIntegration = {
  accessKey: string;
  createdAt: string;
  domain: string;
  id: string;
  origin: string;
};

export type PublicProductApiItem = {
  attributes: Record<string, string>;
  brand: string;
  category: string;
  compareAtPrice: number | null;
  currency: string;
  description: string;
  id: string;
  image: string | null;
  price: number;
  sku: string;
  slug: string;
  stock: number;
  tags: string[];
  title: string;
  updatedAt: string;
};

export type ProductApiDomainsResponse = {
  integrations: ProductApiIntegration[];
};

export type ProductApiDomainMutationResponse = {
  created: boolean;
  integration: ProductApiIntegration;
};

export type PublicProductFeedResponse = {
  generatedAt: string;
  integration: {
    domain: string;
    origin: string;
  };
  products: PublicProductApiItem[];
  total: number;
};
