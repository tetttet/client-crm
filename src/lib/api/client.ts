import {
  createApiCacheKey,
  getCachedApiValue,
  setCachedApiValue,
  type ApiCacheConfig,
} from "@/lib/api/cache";
import type { QueryParams } from "@/lib/api/types/api.types";
import { getAccessToken } from "@/lib/auth/token-storage";

import { ApiError } from "./api-error";

const DEFAULT_API_TIMEOUT_MS = 15_000;
const FALLBACK_API_BASE_URL = "http://localhost:8080";

type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST";

type ApiRequestOptions<TBody = unknown> = {
  auth?: boolean;
  body?: TBody;
  cache?: ApiCacheConfig | false;
  headers?: HeadersInit;
  query?: QueryParams;
  signal?: AbortSignal;
  timeoutMs?: number;
};

function getApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  return configuredBaseUrl || FALLBACK_API_BASE_URL;
}

function buildUrl(path: string, query?: QueryParams) {
  const url = new URL(path, getApiBaseUrl());

  if (!query) {
    return url;
  }

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === null || rawValue === undefined) {
      continue;
    }

    if (Array.isArray(rawValue)) {
      rawValue.forEach((value) => {
        if (value === null || value === undefined) {
          return;
        }

        url.searchParams.append(key, String(value));
      });
      continue;
    }

    url.searchParams.set(key, String(rawValue));
  }

  return url;
}

function isBodyInit(value: unknown): value is BodyInit {
  return (
    typeof value === "string" ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    value instanceof Blob ||
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    (typeof ReadableStream !== "undefined" && value instanceof ReadableStream)
  );
}

function resolveRequestBody(body: unknown, headers: Headers) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isBodyInit(body)) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

function getCacheKey(method: HttpMethod, url: URL, cache: ApiCacheConfig | false) {
  if (!cache) {
    return null;
  }

  return cache.key || createApiCacheKey(method, url.toString());
}

async function parseResponseBody(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const responseText = await response.text();

  if (!responseText) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(responseText) as unknown;
    } catch {
      throw new ApiError({
        details: responseText,
        message: "Failed to parse JSON response.",
        status: response.status,
      });
    }
  }

  return responseText;
}

function extractErrorMessage(body: unknown, fallbackMessage: string) {
  if (!body || typeof body !== "object") {
    return fallbackMessage;
  }

  const baseMessage =
    "message" in body && typeof body.message === "string" && body.message.trim()
      ? body.message
      : "error" in body && typeof body.error === "string" && body.error.trim()
        ? body.error
        : fallbackMessage;

  const details =
    "details" in body
      ? body.details
      : "errors" in body
        ? body.errors
        : null;

  const detailsMessage = formatErrorDetails(details);

  if (
    detailsMessage &&
    detailsMessage.trim() &&
    detailsMessage.trim() !== baseMessage.trim()
  ) {
    return `${baseMessage}: ${detailsMessage}`;
  }

  return baseMessage;
}

function formatErrorDetails(details: unknown): string | null {
  if (!details) {
    return null;
  }

  if (typeof details === "string" && details.trim()) {
    return details;
  }

  if (Array.isArray(details)) {
    const detailItems = details
      .map((item) => {
        if (typeof item === "string" && item.trim()) {
          return item;
        }

        if (!item || typeof item !== "object") {
          return null;
        }

        const record = item as Record<string, unknown>;
        const field =
          typeof record.field === "string" && record.field.trim()
            ? record.field
            : typeof record.path === "string" && record.path.trim()
              ? record.path
              : null;
        const message =
          typeof record.message === "string" && record.message.trim()
            ? record.message
            : typeof record.error === "string" && record.error.trim()
              ? record.error
              : null;

        if (field && message) {
          return `${field}: ${message}`;
        }

        return message;
      })
      .filter((item): item is string => Boolean(item));

    return detailItems.length > 0 ? detailItems.join(", ") : null;
  }

  if (typeof details === "object") {
    const record = details as Record<string, unknown>;

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }

    if (Array.isArray(record.errors)) {
      return formatErrorDetails(record.errors);
    }
  }

  return null;
}

async function request<TResponse, TBody = unknown>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> {
  const {
    auth = true,
    body,
    cache = false,
    headers: rawHeaders,
    query,
    signal,
    timeoutMs = DEFAULT_API_TIMEOUT_MS,
  } = options;

  const url = buildUrl(path, query);
  const cacheConfig = method === "GET" && cache ? cache : null;
  const cacheKey = cacheConfig ? getCacheKey(method, url, cacheConfig) : null;

  if (cacheKey) {
    const cachedValue = getCachedApiValue<TResponse>(cacheKey);

    if (cachedValue !== null) {
      return cachedValue;
    }
  }

  const headers = new Headers(rawHeaders);
  const token = auth ? getAccessToken() : null;

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const controller = new AbortController();
  const bodyPayload = resolveRequestBody(body, headers);
  let timeoutTriggered = false;
  let unsubscribeAbort: (() => void) | null = null;

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      const handleAbort = () => {
        controller.abort(signal.reason);
      };

      signal.addEventListener("abort", handleAbort, { once: true });
      unsubscribeAbort = () => {
        signal.removeEventListener("abort", handleAbort);
      };
    }
  }

  const timeoutId = setTimeout(() => {
    timeoutTriggered = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      body: bodyPayload,
      cache: "no-store",
      headers,
      method,
      signal: controller.signal,
    });

    const parsedBody = await parseResponseBody(response);

    if (!response.ok) {
      throw new ApiError({
        details: parsedBody,
        message: extractErrorMessage(
          parsedBody,
          response.statusText || "Request failed.",
        ),
        status: response.status,
      });
    }

    if (cacheKey && cacheConfig) {
      setCachedApiValue(cacheKey, parsedBody as TResponse, cacheConfig.ttlMs);
    }

    return parsedBody as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError({
        details: error,
        message: timeoutTriggered
          ? `Request timed out after ${timeoutMs}ms.`
          : "Request was aborted.",
        status: timeoutTriggered ? 408 : 499,
      });
    }

    throw new ApiError({
      details: error,
      message:
        error instanceof Error && error.message
          ? error.message
          : "Network request failed.",
      status: 0,
    });
  } finally {
    clearTimeout(timeoutId);
    unsubscribeAbort?.();
  }
}

export const apiClient = {
  delete<TResponse = void>(path: string, options?: ApiRequestOptions) {
    return request<TResponse>("DELETE", path, options);
  },
  get<TResponse>(path: string, options?: ApiRequestOptions) {
    return request<TResponse>("GET", path, options);
  },
  patch<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ) {
    return request<TResponse, TBody>("PATCH", path, options);
  },
  post<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ) {
    return request<TResponse, TBody>("POST", path, options);
  },
};

export {
  DEFAULT_API_TIMEOUT_MS,
  FALLBACK_API_BASE_URL,
  getApiBaseUrl,
};
