"use client";

import { useCallback, useEffect, useState } from "react";

import { toApiError, type ApiError } from "@/lib/api/api-error";
import {
  getEmployeeMe,
  loginEmployee,
  registerEmployeeShortcut,
} from "@/lib/api/services/employee-auth.service";
import type {
  CreateEmployeeBody,
  Employee,
  LoginEmployeeBody,
} from "@/lib/api/types/employee.types";
import { clearSession } from "@/lib/auth/auth-session";

import { useAuthSession } from "./use-auth-session";

type UseEmployeeAuthOptions = {
  autoLoad?: boolean;
};

export function useEmployeeAuth(options: UseEmployeeAuthOptions = {}) {
  const { autoLoad = true } = options;
  const session = useAuthSession();
  const [employeeState, setEmployeeState] = useState<Employee | null>(null);
  const [errorState, setErrorState] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadEmployee = useCallback(async () => {
    if (session.authType !== "employee" || !session.accessToken) {
      return null;
    }

    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await getEmployeeMe();
      setEmployeeState(response.employee);
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Failed to load employee.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken, session.authType]);

  useEffect(() => {
    if (!autoLoad || session.authType !== "employee" || !session.accessToken) {
      return;
    }

    void (async () => {
      await loadEmployee();
    })();
  }, [autoLoad, loadEmployee, session.accessToken, session.authType]);

  const handleLoginEmployee = async (body: LoginEmployeeBody) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await loginEmployee(body);
      setEmployeeState(null);
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Employee auth failed.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterEmployeeShortcut = async (body: CreateEmployeeBody) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      return await registerEmployeeShortcut(body);
    } catch (requestError) {
      const apiError = toApiError(
        requestError,
        "Failed to register employee.",
      );
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSession = () => {
    clearSession();
    setEmployeeState(null);
    setErrorState(null);
  };

  const isAuthenticated =
    session.authType === "employee" && Boolean(session.accessToken);

  return {
    accessToken: session.accessToken,
    authType: session.authType,
    clearSession: handleClearSession,
    companyId: session.companyId,
    employee: isAuthenticated ? employeeState : null,
    error: errorState,
    isAuthenticated,
    isLoading,
    loadEmployee,
    loginEmployee: handleLoginEmployee,
    registerEmployeeShortcut: handleRegisterEmployeeShortcut,
    role: session.employeeRole,
  };
}
