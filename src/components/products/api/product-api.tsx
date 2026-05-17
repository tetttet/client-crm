"use client";
import {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import AddLinkRoundedIcon from "@mui/icons-material/AddLinkRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import RouterRoundedIcon from "@mui/icons-material/RouterRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type {
  ProductApiDomainMutationResponse,
  ProductApiDomainsResponse,
  ProductApiIntegration,
  PublicProductFeedResponse,
} from "@/features/storage/product-api/product-api.types";

const panelSx = {
  background: "#ffffff",
  border: "1px solid #d7dce3",
  borderRadius: 0,
  boxShadow: "none",
};

const codeBlockSx = {
  background: "#0f172a",
  color: "#e2e8f0",
  fontFamily:
    '"SFMono-Regular", "SF Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace',
  fontSize: 13,
  lineHeight: 1.7,
  m: 0,
  overflowX: "auto",
  p: 2,
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: 0,
  },
};

const actionButtonSx = {
  borderRadius: 0,
  boxShadow: "none",
  textTransform: "none",
};

type FeedbackState =
  | {
      message: string;
      severity: "error" | "info" | "success";
    }
  | null;

type ProductApiPreviewPayload = Omit<PublicProductFeedResponse, "products"> & {
  products: Array<
    PublicProductFeedResponse["products"][number] & {
      image: string | null;
    }
  >;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected request error.";
}

async function readApiJson<ResponseType>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<ResponseType> {
  const response = await fetch(input, {
    cache: "no-store",
    ...init,
  });

  const data = (await response
    .json()
    .catch(() => null)) as (ResponseType & { error?: string }) | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed.");
  }

  return data as ResponseType;
}

function formatIntegrationDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

function truncatePreviewPayload(
  payload: PublicProductFeedResponse | null,
): ProductApiPreviewPayload | null {
  if (!payload) {
    return null;
  }

  return {
    ...payload,
    products: payload.products.slice(0, 2).map((product) => ({
      ...product,
      image: product.image ? "[image data omitted for preview]" : null,
    })),
  };
}

async function copyToClipboard(textValue: string) {
  await navigator.clipboard.writeText(textValue);
}

function getNextSelectedIntegrationId(
  integrations: ProductApiIntegration[],
  currentIntegrationId: string,
  preferredIntegrationId?: string,
) {
  if (
    preferredIntegrationId &&
    integrations.some((integration) => integration.id === preferredIntegrationId)
  ) {
    return preferredIntegrationId;
  }

  if (
    currentIntegrationId &&
    integrations.some((integration) => integration.id === currentIntegrationId)
  ) {
    return currentIntegrationId;
  }

  return integrations[0]?.id ?? "";
}

async function fetchIntegrations() {
  const response = await readApiJson<ProductApiDomainsResponse>(
    "/api/product-api/domains",
  );

  return response.integrations;
}

async function fetchPreview(accessKey: string) {
  return readApiJson<PublicProductFeedResponse>(
    `/api/public/products?accessKey=${encodeURIComponent(accessKey)}`,
  );
}

const ProductApi = () => {
  const [domainInput, setDomainInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [integrations, setIntegrations] = useState<ProductApiIntegration[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [preview, setPreview] = useState<PublicProductFeedResponse | null>(null);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState("");
  const [siteOrigin, setSiteOrigin] = useState("");
  const [, startTransition] = useTransition();

  const selectedIntegration =
    integrations.find(
      (integration) => integration.id === selectedIntegrationId,
    ) ??
    integrations[0] ??
    null;

  const previewPayload = useMemo(
    () => (selectedIntegration ? truncatePreviewPayload(preview) : null),
    [preview, selectedIntegration],
  );

  const apiEndpoint = selectedIntegration
    ? `${siteOrigin}/api/public/products?accessKey=${selectedIntegration.accessKey}`
    : `${siteOrigin || "https://your-domain.com"}/api/public/products?accessKey=...`;

  const browserSnippet = selectedIntegration
    ? `const response = await fetch("${apiEndpoint}");
const data = await response.json();

console.log(data.products);`
    : `// Add a domain first to generate a ready-to-use browser URL`;

  const serverSnippet = selectedIntegration
    ? `const response = await fetch("${apiEndpoint}", {
  cache: "no-store",
});

const data = await response.json();`
    : `// Add a domain first to generate a ready-to-use server request`;

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setSiteOrigin(window.location.origin);
    });

    let isActive = true;

    async function loadIntegrations() {
      try {
        const nextIntegrations = await fetchIntegrations();

        if (!isActive) {
          return;
        }

        startTransition(() => {
          setIntegrations(nextIntegrations);
          setSelectedIntegrationId((currentIntegrationId) =>
            getNextSelectedIntegrationId(
              nextIntegrations,
              currentIntegrationId,
            ),
          );
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setFeedback({
          message: getErrorMessage(error),
          severity: "error",
        });
      } finally {
        if (isActive) {
          setIsBootstrapping(false);
        }
      }
    }

    void loadIntegrations();

    return () => {
      isActive = false;
      window.cancelAnimationFrame(frameId);
    };
  }, [startTransition]);

  useEffect(() => {
    if (!selectedIntegration) {
      return;
    }

    let isActive = true;

    async function loadPreview() {
      setIsPreviewLoading(true);

      try {
        const response = await fetchPreview(selectedIntegration.accessKey);

        if (!isActive) {
          return;
        }

        startTransition(() => {
          setPreview(response);
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setFeedback({
          message: getErrorMessage(error),
          severity: "error",
        });
      } finally {
        if (isActive) {
          setIsPreviewLoading(false);
        }
      }
    }

    void loadPreview();

    return () => {
      isActive = false;
    };
  }, [selectedIntegration, startTransition]);

  const handleAddDomain = async () => {
    const trimmedDomain = domainInput.trim();

    if (!trimmedDomain) {
      setFeedback({
        message: "Enter a domain name before creating access.",
        severity: "error",
      });
      return;
    }

    setFeedback(null);
    setIsMutating(true);

    try {
      const response = await readApiJson<ProductApiDomainMutationResponse>(
        "/api/product-api/domains",
        {
          body: JSON.stringify({
            domain: trimmedDomain,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );

      setDomainInput("");
      const nextIntegrations = await fetchIntegrations();

      startTransition(() => {
        setIntegrations(nextIntegrations);
        setSelectedIntegrationId((currentIntegrationId) =>
          getNextSelectedIntegrationId(
            nextIntegrations,
            currentIntegrationId,
            response.integration.id,
          ),
        );
      });

      setFeedback({
        message: response.created
          ? `Access created for ${response.integration.origin}.`
          : `Domain ${response.integration.origin} already has an access key.`,
        severity: "success",
      });
    } catch (error) {
      setFeedback({
        message: getErrorMessage(error),
        severity: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    setFeedback(null);
    setIsMutating(true);

    try {
      await readApiJson<{ removedId: string }>("/api/product-api/domains", {
        body: JSON.stringify({
          id: integrationId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });

      if (selectedIntegrationId === integrationId) {
        setSelectedIntegrationId("");
      }

      const nextIntegrations = await fetchIntegrations();

      startTransition(() => {
        setIntegrations(nextIntegrations);
        setSelectedIntegrationId((currentIntegrationId) =>
          getNextSelectedIntegrationId(
            nextIntegrations,
            currentIntegrationId,
          ),
        );
      });

      setFeedback({
        message: "Integration removed.",
        severity: "success",
      });
    } catch (error) {
      setFeedback({
        message: getErrorMessage(error),
        severity: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleCopyValue = async (value: string, label: string) => {
    try {
      await copyToClipboard(value);
      setFeedback({
        message: `${label} copied.`,
        severity: "success",
      });
    } catch {
      setFeedback({
        message: `Could not copy ${label.toLowerCase()}.`,
        severity: "error",
      });
    }
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ ...panelSx, borderTop: "3px solid #1976d2", p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, letterSpacing: "-0.02em" }} variant="h4">
                Product API access
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 760 }} variant="body1">
                Add a client website domain, generate its access key, and let that
                site load your active products through a public API endpoint.
              </Typography>
            </Box>

            <Chip
              icon={<PublicRoundedIcon />}
              label={`${integrations.length} allowed site${integrations.length === 1 ? "" : "s"}`}
              sx={{
                bgcolor: "#e3f2fd",
                borderRadius: 0,
                color: "#1565c0",
                fontWeight: 700,
                px: 1,
              }}
            />
          </Stack>

          {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
            }}
          >
            {[
              {
                icon: <RouterRoundedIcon sx={{ color: "#1976d2" }} />,
                label: "Public endpoint",
                value: "/api/public/products",
              },
              {
                icon: <KeyRoundedIcon sx={{ color: "#1565c0" }} />,
                label: "Access keys",
                value: String(integrations.length),
              },
              {
                icon: <AddLinkRoundedIcon sx={{ color: "#2e7d32" }} />,
                label: "Active products in feed",
                value: preview ? String(preview.total) : "0",
              },
            ].map((metric) => (
              <Paper
                key={metric.label}
                sx={{
                  ...panelSx,
                  borderTop: "3px solid #d7dce3",
                  p: 2,
                }}
              >
                <Stack direction="row" spacing={1.5}>
                  <Box>{metric.icon}</Box>
                  <Stack spacing={0.25}>
                    <Typography color="text.secondary" variant="caption">
                      {metric.label}
                    </Typography>
                    <Typography sx={{ fontWeight: 800 }} variant="h6">
                      {metric.value}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
          },
        }}
      >
        <Paper sx={{ ...panelSx, p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontWeight: 800 }} variant="h6">
                Allow a website
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Example: <code>shop.example.com</code> or <code>https://shop.example.com</code>
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <TextField
                fullWidth
                label="Client website domain"
                onChange={(event) => {
                  setDomainInput(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleAddDomain();
                  }
                }}
                placeholder="shop.example.com"
                sx={fieldSx}
                value={domainInput}
              />
              <Button
                disabled={isMutating}
                onClick={() => {
                  void handleAddDomain();
                }}
                startIcon={
                  isMutating ? <CircularProgress color="inherit" size={18} /> : <AddLinkRoundedIcon />
                }
                sx={{
                  ...actionButtonSx,
                  minWidth: { sm: 180 },
                }}
                variant="contained"
              >
                Create access
              </Button>
            </Stack>

            <Alert severity="info">
              This setup protects browser access with a domain allowlist and an
              access key. For tighter security, keep the key on the client
              website backend whenever possible. Right now integrations are kept
              in server memory, so the list resets after a full server restart.
            </Alert>
          </Stack>
        </Paper>

        <Paper sx={{ ...panelSx, overflow: "hidden" }}>
          <Box sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={2}>
              <Box>
                <Typography sx={{ fontWeight: 800 }} variant="h6">
                  Usage
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  The selected integration gets its own endpoint URL with an access key.
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Ready endpoint"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                sx={fieldSx}
                value={apiEndpoint}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  disabled={!selectedIntegration}
                  onClick={() => {
                    void handleCopyValue(apiEndpoint, "Endpoint URL");
                  }}
                  startIcon={<ContentCopyRoundedIcon />}
                  sx={actionButtonSx}
                  variant="outlined"
                >
                  Copy endpoint
                </Button>
                <Button
                  disabled={!selectedIntegration}
                  onClick={() => {
                    if (!selectedIntegration) {
                      return;
                    }

                    void handleCopyValue(selectedIntegration.accessKey, "Access key");
                  }}
                  startIcon={<KeyRoundedIcon />}
                  sx={actionButtonSx}
                  variant="outlined"
                >
                  Copy key
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Box component="pre" sx={codeBlockSx}>
            {browserSnippet}
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ ...panelSx, p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            sx={{
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800 }} variant="h6">
                Connected sites
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Pick an integration to refresh the preview and generated snippets.
              </Typography>
            </Box>

            {isBootstrapping ? (
              <CircularProgress size={20} />
            ) : (
              <Chip
                label={`${integrations.length} integration${integrations.length === 1 ? "" : "s"}`}
                sx={{ borderRadius: 0, fontWeight: 700 }}
                variant="outlined"
              />
            )}
          </Stack>

          {integrations.length === 0 && !isBootstrapping ? (
            <Alert severity="info">
              No sites are connected yet. Add the first domain above and the API URL
              will be generated automatically.
            </Alert>
          ) : null}

          <Stack spacing={1.25}>
            {integrations.map((integration) => {
              const isSelected = integration.id === selectedIntegration?.id;

              return (
                <Paper
                  key={integration.id}
                  sx={{
                    ...panelSx,
                    borderColor: isSelected ? "#1976d2" : "#d7dce3",
                    borderTop: `3px solid ${isSelected ? "#1976d2" : "#d7dce3"}`,
                    cursor: "pointer",
                    p: 2,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={2}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Stack
                      onClick={() => {
                        setSelectedIntegrationId(integration.id);
                      }}
                      spacing={1}
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: "wrap" }}
                      >
                        <Chip
                          label={isSelected ? "Preview active" : "Ready"}
                          sx={{
                            bgcolor: isSelected ? "#e3f2fd" : "#f5f7fa",
                            borderRadius: 0,
                            color: isSelected ? "#1565c0" : "#52606d",
                            fontWeight: 700,
                          }}
                        />
                        <Chip
                          label={`Added ${formatIntegrationDate(integration.createdAt)}`}
                          sx={{ borderRadius: 0 }}
                          variant="outlined"
                        />
                      </Stack>

                      <Box>
                        <Typography sx={{ fontWeight: 800 }} variant="subtitle1">
                          {integration.domain}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {integration.origin}
                        </Typography>
                      </Box>

                      <TextField
                        fullWidth
                        label="Access key"
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                        sx={fieldSx}
                        value={integration.accessKey}
                      />
                    </Stack>

                    <Stack
                      direction={{ xs: "column", sm: "row", lg: "column" }}
                      spacing={1}
                    >
                      <Button
                        onClick={() => {
                          setSelectedIntegrationId(integration.id);
                        }}
                        sx={actionButtonSx}
                        variant={isSelected ? "contained" : "outlined"}
                      >
                        Use in preview
                      </Button>
                      <Button
                        onClick={() => {
                          const integrationUrl = `${siteOrigin}/api/public/products?accessKey=${integration.accessKey}`;
                          void handleCopyValue(integrationUrl, "Integration URL");
                        }}
                        startIcon={<ContentCopyRoundedIcon />}
                        sx={actionButtonSx}
                        variant="outlined"
                      >
                        Copy URL
                      </Button>
                      <Button
                        color="error"
                        disabled={isMutating}
                        onClick={() => {
                          void handleDeleteIntegration(integration.id);
                        }}
                        startIcon={<DeleteOutlineRoundedIcon />}
                        sx={actionButtonSx}
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
          },
        }}
      >
        <Paper sx={{ ...panelSx, overflow: "hidden" }}>
          <Box
            sx={{
              alignItems: "center",
              borderBottom: "1px solid #d7dce3",
              display: "flex",
              justifyContent: "space-between",
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800 }} variant="h6">
                Live response preview
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Showing the first 2 products with image data shortened for readability.
              </Typography>
            </Box>

            {isPreviewLoading ? <CircularProgress size={20} /> : null}
          </Box>

          <Box component="pre" sx={codeBlockSx}>
            {previewPayload
              ? JSON.stringify(previewPayload, null, 2)
              : "// Select or create an integration to load the product feed"}
          </Box>
        </Paper>

        <Paper sx={{ ...panelSx, overflow: "hidden" }}>
          <Box sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={2}>
              <Box>
                <Typography sx={{ fontWeight: 800 }} variant="h6">
                  Server-side example
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Use this if the client website should fetch products on its backend first.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box component="pre" sx={codeBlockSx}>
            {serverSnippet}
          </Box>
        </Paper>
      </Box>
    </Stack>
  );
};

export default ProductApi;
