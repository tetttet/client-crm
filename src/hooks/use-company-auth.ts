"use client";

import { useCallback, useEffect, useState } from "react";

import { toApiError, type ApiError } from "@/lib/api/api-error";
import {
  loginCompany,
  registerCompany,
} from "@/lib/api/services/auth.service";
import {
  getCompanyMe,
  updateCompanyMe,
} from "@/lib/api/services/companies.service";
import type {
  Company,
  LoginCompanyBody,
  RegisterCompanyBody,
  UpdateCompanyMeBody,
} from "@/lib/api/types/company.types";
import { clearSession } from "@/lib/auth/auth-session";

import { useAuthSession } from "./use-auth-session";

type UseCompanyAuthOptions = {
  autoLoad?: boolean;
};

export function useCompanyAuth(options: UseCompanyAuthOptions = {}) {
  const { autoLoad = true } = options;
  const session = useAuthSession();
  const [companyState, setCompanyState] = useState<Company | null>(null);
  const [errorState, setErrorState] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadCompany = useCallback(async () => {
    if (session.authType !== "company" || !session.accessToken) {
      return null;
    }

    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await getCompanyMe();
      setCompanyState(response.company);
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Failed to load company.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken, session.authType]);

  useEffect(() => {
    if (!autoLoad || session.authType !== "company" || !session.accessToken) {
      return;
    }

    void (async () => {
      await loadCompany();
    })();
  }, [autoLoad, loadCompany, session.accessToken, session.authType]);

  const handleLoginCompany = async (body: LoginCompanyBody) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await loginCompany(body);
      setCompanyState(response.company);
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Company auth failed.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterCompany = async (body: RegisterCompanyBody) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await registerCompany(body);
      setCompanyState(response.company);
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Company auth failed.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCompany = async (body: UpdateCompanyMeBody) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await updateCompanyMe(body);
      setCompanyState(response.company);
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Failed to update company.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSession = () => {
    clearSession();
    setCompanyState(null);
    setErrorState(null);
  };

  const isAuthenticated =
    session.authType === "company" && Boolean(session.accessToken);

  return {
    accessToken: session.accessToken,
    authType: session.authType,
    clearSession: handleClearSession,
    company: isAuthenticated ? companyState : null,
    companyId: session.companyId,
    error: errorState,
    isAuthenticated,
    isLoading,
    loadCompany,
    loginCompany: handleLoginCompany,
    registerCompany: handleRegisterCompany,
    updateCompany: handleUpdateCompany,
  };
}
