"use client";

import { useCallback, useEffect, useState } from "react";

import { toApiError, type ApiError } from "@/lib/api/api-error";
import {
  createCompanyPage,
  deleteMyCompanyPage,
  getCompanyPageBySlug,
  getMyCompanyPage,
  updateMyCompanyPage,
} from "@/lib/api/services/company-pages.service";
import type {
  CompanyPage,
  CreateCompanyPageBody,
  UpdateMyCompanyPageBody,
} from "@/lib/api/types/company-page.types";

import { useAuthSession } from "./use-auth-session";

type UseCompanyPageOptions = {
  autoLoad?: boolean;
  enabled?: boolean;
  slug?: string;
};

export function useCompanyPage(options: UseCompanyPageOptions = {}) {
  const { autoLoad = true, enabled = true, slug } = options;
  const session = useAuthSession();
  const [companyPage, setCompanyPage] = useState<CompanyPage | null>(null);
  const [errorState, setErrorState] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const loadMyCompanyPage = useCallback(async () => {
    if (!session.accessToken) {
      return null;
    }

    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await getMyCompanyPage();
      setCompanyPage(response.companyPage);
      return response;
    } catch (requestError) {
      const apiError = toApiError(
        requestError,
        "Failed to load company page.",
      );

      if (apiError.status === 404) {
        setCompanyPage(null);
        setErrorState(null);
        return null;
      }

      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken]);

  const loadPublicCompanyPage = useCallback(async (nextSlug: string) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await getCompanyPageBySlug(nextSlug);
      setCompanyPage(response.companyPage);
      return response;
    } catch (requestError) {
      const apiError = toApiError(
        requestError,
        "Failed to load public company page.",
      );
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !autoLoad) {
      return;
    }

    if (slug) {
      void (async () => {
        try {
          await loadPublicCompanyPage(slug);
        } catch {
          return;
        }
      })();
      return;
    }

    if (!session.accessToken) {
      return;
    }

    void (async () => {
      try {
        await loadMyCompanyPage();
      } catch {
        return;
      }
    })();
  }, [
    autoLoad,
    enabled,
    loadMyCompanyPage,
    loadPublicCompanyPage,
    session.accessToken,
    slug,
  ]);

  async function runMutation<TResponse>(request: Promise<TResponse>) {
    setIsMutating(true);
    setErrorState(null);

    try {
      const response = await request;

      if (slug) {
        await loadPublicCompanyPage(slug);
      } else {
        await loadMyCompanyPage();
      }

      return response;
    } catch (requestError) {
      const apiError = toApiError(
        requestError,
        "Company page request failed.",
      );
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  const handleDeleteMyCompanyPage = async () => {
    setIsMutating(true);
    setErrorState(null);

    try {
      const response = await deleteMyCompanyPage();
      setCompanyPage(null);
      return response;
    } catch (requestError) {
      const apiError = toApiError(
        requestError,
        "Company page request failed.",
      );
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  };

  const isPublicMode = Boolean(slug);
  const hasSession = Boolean(session.accessToken);

  return {
    companyPage,
    createCompanyPage: (body: CreateCompanyPageBody) =>
      runMutation(createCompanyPage(body)),
    deleteMyCompanyPage: handleDeleteMyCompanyPage,
    error: isPublicMode || hasSession ? errorState : null,
    isLoading: isPublicMode || hasSession ? isLoading : false,
    isMutating,
    loadMyCompanyPage,
    loadPublicCompanyPage,
    updateMyCompanyPage: (body: UpdateMyCompanyPageBody) =>
      runMutation(updateMyCompanyPage(body)),
  };
}
