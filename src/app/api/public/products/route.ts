import type { NextRequest } from "next/server";

import { getPublicProductFeed } from "@/features/storage/product-api/public-product-feed";
import { getProductApiIntegrationByAccessKey } from "@/features/storage/product-api/product-api-registry";
import type { PublicProductFeedResponse } from "@/features/storage/product-api/product-api.types";

export const dynamic = "force-dynamic";

const allowedMethodsHeaderValue = "GET, OPTIONS";

function getAccessKey(request: NextRequest) {
  return request.nextUrl.searchParams.get("accessKey")?.trim() ?? "";
}

function getBaseHeaders() {
  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": allowedMethodsHeaderValue,
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

function isAllowedRequestOrigin(
  requestOrigin: string | null,
  requestUrlOrigin: string,
  integrationOrigin: string,
) {
  if (!requestOrigin) {
    return true;
  }

  if (requestOrigin === requestUrlOrigin) {
    return true;
  }

  return requestOrigin.toLowerCase() === integrationOrigin;
}

function buildCorsHeaders(
  requestOrigin: string | null,
  requestUrlOrigin: string,
  integrationOrigin: string,
) {
  if (!requestOrigin) {
    return getBaseHeaders();
  }

  if (!isAllowedRequestOrigin(requestOrigin, requestUrlOrigin, integrationOrigin)) {
    return getBaseHeaders();
  }

  return {
    ...getBaseHeaders(),
    "Access-Control-Allow-Origin": requestOrigin,
  };
}

function createUnauthorizedResponse(message: string) {
  return Response.json(
    {
      error: message,
    },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  const accessKey = getAccessKey(request);

  if (!accessKey) {
    return createUnauthorizedResponse(
      "Missing access key. Add ?accessKey=... to the request URL.",
    );
  }

  const integration = getProductApiIntegrationByAccessKey(accessKey);

  if (!integration) {
    return createUnauthorizedResponse("Invalid access key.");
  }

  const requestOrigin = request.headers.get("origin");
  const requestUrlOrigin = request.nextUrl.origin.toLowerCase();

  if (
    !isAllowedRequestOrigin(
      requestOrigin,
      requestUrlOrigin,
      integration.origin,
    )
  ) {
    return Response.json(
      {
        error: `Origin ${requestOrigin} is not allowed for ${integration.domain}.`,
      },
      { status: 403 },
    );
  }

  const publicProductFeed = getPublicProductFeed();
  const responseBody: PublicProductFeedResponse = {
    ...publicProductFeed,
    integration: {
      domain: integration.domain,
      origin: integration.origin,
    },
  };

  return Response.json(responseBody, {
    headers: buildCorsHeaders(
      requestOrigin,
      requestUrlOrigin,
      integration.origin,
    ),
  });
}

export async function OPTIONS(request: NextRequest) {
  const accessKey = getAccessKey(request);

  if (!accessKey) {
    return new Response(null, {
      headers: getBaseHeaders(),
      status: 400,
    });
  }

  const integration = getProductApiIntegrationByAccessKey(accessKey);

  if (!integration) {
    return new Response(null, {
      headers: getBaseHeaders(),
      status: 401,
    });
  }

  const requestOrigin = request.headers.get("origin");
  const requestUrlOrigin = request.nextUrl.origin.toLowerCase();

  if (
    !isAllowedRequestOrigin(
      requestOrigin,
      requestUrlOrigin,
      integration.origin,
    )
  ) {
    return new Response(null, {
      headers: getBaseHeaders(),
      status: 403,
    });
  }

  return new Response(null, {
    headers: buildCorsHeaders(
      requestOrigin,
      requestUrlOrigin,
      integration.origin,
    ),
    status: 204,
  });
}
