import { CompanyAuthForm } from "@/components/auth/company-auth-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function CreateCompanyPage() {
  return (
    <AuthPageShell
      description="Создайте новую компанию, получите company token и сразу переходите в CRM dashboard для дальнейшей настройки."
      eyebrow="Company Registration"
      title="Новый аккаунт компании"
    >
      <CompanyAuthForm mode="create" />
    </AuthPageShell>
  );
}
