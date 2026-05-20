"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useCompanyAuth } from "@/hooks/use-company-auth";

type CompanyAuthFormProps = Readonly<{
  mode: "create" | "login";
}>;

type CompanyAuthFormValues = {
  adminLogin: string;
  name: string;
  password: string;
};

const initialValues: CompanyAuthFormValues = {
  adminLogin: "",
  name: "",
  password: "",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: 0,
  },
};

export function CompanyAuthForm({ mode }: CompanyAuthFormProps) {
  const router = useRouter();
  const {
    error,
    isAuthenticated,
    loginCompany,
    registerCompany,
  } = useCompanyAuth({
    autoLoad: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<CompanyAuthFormValues>(initialValues);
  const submitLockRef = useRef(false);

  const isCreateMode = mode === "create";

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleFieldChange =
    (field: keyof CompanyAuthFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      if (isCreateMode) {
        await registerCompany({
          adminLogin: values.adminLogin.trim(),
          name: values.name.trim(),
          password: values.password,
        });
      } else {
        await loginCompany({
          adminLogin: values.adminLogin.trim(),
          password: values.password,
        });
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      return;
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={3}>
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: 700 }} variant="h4">
          {isCreateMode ? "Создать компанию" : "Войти в компанию"}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {isCreateMode
            ? "Заполните данные компании. После регистрации вы сразу попадёте в CRM dashboard."
            : "Введите данные администратора компании, чтобы открыть CRM dashboard."}
        </Typography>
      </Stack>

      <Divider />

      {error ? <Alert severity="error">{error.message}</Alert> : null}

      <Stack spacing={2}>
        {isCreateMode ? (
          <TextField
            autoComplete="organization"
            fullWidth
            label="Название компании"
            onChange={handleFieldChange("name")}
            required
            sx={fieldSx}
            value={values.name}
          />
        ) : null}

        <TextField
          autoComplete="username"
          fullWidth
          label="Логин администратора"
          onChange={handleFieldChange("adminLogin")}
          required
          sx={fieldSx}
          value={values.adminLogin}
        />

        <TextField
          autoComplete={isCreateMode ? "new-password" : "current-password"}
          fullWidth
          label="Пароль"
          onChange={handleFieldChange("password")}
          required
          sx={fieldSx}
          type="password"
          value={values.password}
        />
      </Stack>

      <Button
        disabled={isSubmitting}
        fullWidth
        size="large"
        startIcon={
          isSubmitting ? (
            <CircularProgress color="inherit" size={18} />
          ) : isCreateMode ? (
            <PersonAddAlt1RoundedIcon />
          ) : (
            <LoginRoundedIcon />
          )
        }
        sx={{
          borderRadius: 0,
          minHeight: 52,
          textTransform: "none",
        }}
        type="submit"
        variant="contained"
      >
        {isSubmitting
          ? "Подождите..."
          : isCreateMode
            ? "Создать и войти"
            : "Войти в CRM"}
      </Button>

      <Box
        sx={{
          border: "1px solid #d7dce3",
          borderRadius: 0,
          p: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700 }} variant="body2">
          {isCreateMode ? "Уже есть компания?" : "Ещё нет компании?"}
        </Typography>
        <Button
          color="primary"
          component={Link}
          href={isCreateMode ? "/company/login" : "/company/create"}
          sx={{
            borderRadius: 0,
            mt: 1,
            px: 0,
            textTransform: "none",
          }}
        >
          {isCreateMode ? "Перейти ко входу" : "Создать новую компанию"}
        </Button>
      </Box>
    </Stack>
  );
}
