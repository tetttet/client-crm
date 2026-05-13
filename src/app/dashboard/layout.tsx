import type { Metadata } from "next";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardThemeProvider } from "@/components/layout/dashboard-theme-provider";

export const metadata: Metadata = {
  title: "Dashboard - CRM",
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardThemeProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardThemeProvider>
  );
}
