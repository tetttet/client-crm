"use client";

import { useCallback, useEffect, useState } from "react";

import { toApiError, type ApiError } from "@/lib/api/api-error";
import {
  createEmployee,
  deleteEmployee,
  deleteMe,
  getEmployeeById,
  getEmployees,
  updateEmployee,
  updateMe,
} from "@/lib/api/services/employees.service";
import type {
  CreateEmployeeBody,
  Employee,
  EmployeesQuery,
  UpdateEmployeeBody,
  UpdateEmployeeMeBody,
} from "@/lib/api/types/employee.types";
import { clearSession } from "@/lib/auth/auth-session";

import { useAuthSession } from "./use-auth-session";

type UseEmployeesOptions = {
  autoLoad?: boolean;
  enabled?: boolean;
  initialQuery?: EmployeesQuery;
};

export function useEmployees(options: UseEmployeesOptions = {}) {
  const { autoLoad = true, enabled = true, initialQuery = {} } = options;
  const session = useAuthSession();
  const [employeesState, setEmployeesState] = useState<Employee[]>([]);
  const [errorState, setErrorState] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [query, setQuery] = useState<EmployeesQuery>(initialQuery);
  const [totalState, setTotalState] = useState(0);

  const refetch = useCallback(async (overrideQuery?: EmployeesQuery) => {
    if (!session.accessToken) {
      return null;
    }

    const nextQuery = {
      ...query,
      ...overrideQuery,
    };

    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await getEmployees(nextQuery);
      setEmployeesState(response.employees);
      setTotalState(response.total);
      return response;
    } catch (requestError) {
      const apiError = toApiError(requestError, "Failed to load employees.");
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [query, session.accessToken]);

  useEffect(() => {
    if (!enabled || !autoLoad || !session.accessToken) {
      return;
    }

    void (async () => {
      try {
        await refetch();
      } catch {
        return;
      }
    })();
  }, [autoLoad, enabled, refetch, session.accessToken]);

  async function runMutation<TResponse>(request: Promise<TResponse>) {
    setIsMutating(true);
    setErrorState(null);

    try {
      const response = await request;
      await refetch();
      return response;
    } catch (requestError) {
      const apiError = toApiError(
        requestError,
        "Employee request failed.",
      );
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  const handleDeleteMe = async () => {
    setIsMutating(true);
    setErrorState(null);

    try {
      const response = await deleteMe();
      clearSession();
      setEmployeesState([]);
      setTotalState(0);
      return response;
    } catch (requestError) {
      const apiError = toApiError(
        requestError,
        "Employee request failed.",
      );
      setErrorState(apiError);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  };

  const hasSession = Boolean(session.accessToken);

  return {
    createEmployee: (body: CreateEmployeeBody) =>
      runMutation(createEmployee(body)),
    deleteEmployee: (id: number | string) => runMutation(deleteEmployee(id)),
    deleteMe: handleDeleteMe,
    employees: hasSession ? employeesState : [],
    error: hasSession ? errorState : null,
    getEmployeeById,
    isLoading: hasSession ? isLoading : false,
    isMutating,
    query,
    refetch,
    setQuery,
    total: hasSession ? totalState : 0,
    updateEmployee: (id: number | string, body: UpdateEmployeeBody) =>
      runMutation(updateEmployee(id, body)),
    updateMe: (body: UpdateEmployeeMeBody) => runMutation(updateMe(body)),
  };
}
