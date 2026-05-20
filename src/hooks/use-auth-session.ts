"use client";

import { useSyncExternalStore } from "react";

import {
  getSessionSnapshot,
  subscribeToSessionChanges,
} from "@/lib/auth/auth-session";

export function useAuthSession() {
  return useSyncExternalStore(
    subscribeToSessionChanges,
    getSessionSnapshot,
    getSessionSnapshot,
  );
}
