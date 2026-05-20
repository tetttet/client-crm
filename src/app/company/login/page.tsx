import { CompanyAuthForm } from "@/components/auth/company-auth-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function LoginCompanyPage() {
  return (
    <AuthPageShell
      description="Войдите под администратором компании, чтобы открыть dashboard и управлять сотрудниками, товарами и страницей компании."
      eyebrow="Company Login"
      title="Вход в CRM компании"
    >
      <CompanyAuthForm mode="login" />
    </AuthPageShell>
  );
}
