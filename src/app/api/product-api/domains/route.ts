import type { NextRequest } from "next/server";

import {
  listProductApiIntegrations,
  removeProductApiIntegration,
  upsertProductApiIntegration,
} from "@/features/storage/product-api/product-api-registry";
import type {
  ProductApiDomainMutationResponse,
  ProductApiDomainsResponse,
} from "@/features/storage/product-api/product-api.types";

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error.";
}

export async function GET() {
  const responseBody: ProductApiDomainsResponse = {
    integrations: listProductApiIntegrations(),
  };

  return Response.json(responseBody, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: NextRequest) {
  let payload: { domain?: string };

  try {
    payload = (await request.json()) as { domain?: string };
  } catch {
    return Response.json(
      {
        error: "Invalid JSON body.",
      },
      { status: 400 },
    );
  }

  try {
    const result = upsertProductApiIntegration(payload.domain ?? "");
    const responseBody: ProductApiDomainMutationResponse = {
      created: result.created,
      integration: result.integration,
    };

    return Response.json(responseBody, {
      headers: {
        "Cache-Control": "no-store",
      },
      status: result.created ? 201 : 200,
    });
  } catch (error) {
    return Response.json(
      {
        error: getErrorMessage(error),
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  let payload: { id?: string };

  try {
    payload = (await request.json()) as { id?: string };
  } catch {
    return Response.json(
      {
        error: "Invalid JSON body.",
      },
      { status: 400 },
    );
  }

  const integrationId = payload.id?.trim();

  if (!integrationId) {
    return Response.json(
      {
        error: "Integration id is required.",
      },
      { status: 400 },
    );
  }

  const removedIntegration = removeProductApiIntegration(integrationId);

  if (!removedIntegration) {
    return Response.json(
      {
        error: "Integration was not found.",
      },
      { status: 404 },
    );
  }

  return Response.json(
    {
      removedId: removedIntegration.id,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
