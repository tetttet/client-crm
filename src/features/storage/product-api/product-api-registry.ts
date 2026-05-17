import type { ProductApiIntegration } from "./product-api.types";

type ProductApiRegistryState = {
  integrationIdsByAccessKey: Map<string, string>;
  integrationsById: Map<string, ProductApiIntegration>;
};

type ProductApiRegistryGlobal = typeof globalThis & {
  __productApiRegistry__?: ProductApiRegistryState;
};

type ProductApiDomainInput = {
  domain: string;
  origin: string;
};

type UpsertProductApiIntegrationResult = {
  created: boolean;
  integration: ProductApiIntegration;
};

const productApiRegistryGlobal = globalThis as ProductApiRegistryGlobal;

function createRegistryState(): ProductApiRegistryState {
  return {
    integrationsById: new Map<string, ProductApiIntegration>(),
    integrationIdsByAccessKey: new Map<string, string>(),
  };
}

function getRegistryState() {
  if (!productApiRegistryGlobal.__productApiRegistry__) {
    productApiRegistryGlobal.__productApiRegistry__ = createRegistryState();
  }

  return productApiRegistryGlobal.__productApiRegistry__;
}

function hasProtocol(value: string) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);
}

function normalizeProductApiDomain(input: string): ProductApiDomainInput {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    throw new Error("Enter a domain name like shop.example.com.");
  }

  const candidate = hasProtocol(trimmedInput)
    ? trimmedInput
    : `https://${trimmedInput}`;

  let url: URL;

  try {
    url = new URL(candidate);
  } catch {
    throw new Error("Enter a valid domain or URL.");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only http:// or https:// domains are supported.");
  }

  if (!url.hostname) {
    throw new Error("The domain name is missing.");
  }

  return {
    domain: url.host.toLowerCase(),
    origin: url.origin.toLowerCase(),
  };
}

function createAccessKey() {
  return `pak_${crypto.randomUUID().replaceAll("-", "")}`;
}

function createIntegration({
  domain,
  origin,
}: ProductApiDomainInput): ProductApiIntegration {
  return {
    accessKey: createAccessKey(),
    createdAt: new Date().toISOString(),
    domain,
    id: crypto.randomUUID(),
    origin,
  };
}

export function listProductApiIntegrations() {
  return Array.from(getRegistryState().integrationsById.values()).sort(
    (leftIntegration, rightIntegration) =>
      rightIntegration.createdAt.localeCompare(leftIntegration.createdAt),
  );
}

export function upsertProductApiIntegration(
  input: string,
): UpsertProductApiIntegrationResult {
  const normalizedDomain = normalizeProductApiDomain(input);
  const registryState = getRegistryState();
  const existingIntegration = Array.from(
    registryState.integrationsById.values(),
  ).find(
    (integration) => integration.origin === normalizedDomain.origin,
  );

  if (existingIntegration) {
    return {
      created: false,
      integration: existingIntegration,
    };
  }

  const integration = createIntegration(normalizedDomain);

  registryState.integrationsById.set(integration.id, integration);
  registryState.integrationIdsByAccessKey.set(integration.accessKey, integration.id);

  return {
    created: true,
    integration,
  };
}

export function getProductApiIntegrationByAccessKey(accessKey: string) {
  const registryState = getRegistryState();
  const integrationId = registryState.integrationIdsByAccessKey.get(
    accessKey.trim(),
  );

  if (!integrationId) {
    return null;
  }

  return registryState.integrationsById.get(integrationId) ?? null;
}

export function removeProductApiIntegration(integrationId: string) {
  const registryState = getRegistryState();
  const integration = registryState.integrationsById.get(integrationId);

  if (!integration) {
    return null;
  }

  registryState.integrationsById.delete(integrationId);
  registryState.integrationIdsByAccessKey.delete(integration.accessKey);

  return integration;
}
