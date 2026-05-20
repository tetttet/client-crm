type ApiErrorInput = {
  details?: unknown;
  message: string;
  status: number;
};

export class ApiError extends Error {
  details?: unknown;
  status: number;

  constructor({ details, message, status }: ApiErrorInput) {
    super(message);
    this.name = "ApiError";
    this.details = details;
    this.status = status;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function toApiError(
  error: unknown,
  fallbackMessage = "Unexpected API error.",
) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError({
      details: error,
      message: error.message || fallbackMessage,
      status: 0,
    });
  }

  return new ApiError({
    details: error,
    message: fallbackMessage,
    status: 0,
  });
}
