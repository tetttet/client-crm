import Link from "next/link";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function Home() {
  return (
    <AuthPageShell
      description="Подключение уже готового backend API на localhost:8080. Выберите действие и перейдите в CRM через удобные MUI-экраны."
      eyebrow="Client CRM"
      title="Добро пожаловать в CRM"
    >
      <Stack
        spacing={3}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          textAlign: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700 }} variant="h4">
            Выберите, как начать работу
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body1">
            Создайте новую компанию или войдите в уже существующую. После этого
            приложение откроет dashboard CRM.
          </Typography>
        </Box>

        <Paper
          sx={{
            border: "1px solid #d7dce3",
            borderRadius: 0,
            maxWidth: 520,
            p: { xs: 2.5, md: 3 },
            width: "100%",
          }}
        >
          <Stack spacing={2}>
            <Link
              href="/company/create"
              style={{ display: "block", textDecoration: "none", width: "100%" }}
            >
              <Button
                component="span"
                fullWidth
                size="large"
                startIcon={<AddBusinessRoundedIcon />}
                sx={{ borderRadius: 0, minHeight: 52, textTransform: "none" }}
                variant="contained"
              >
                Создать компанию
              </Button>
            </Link>

            <Link
              href="/company/login"
              style={{ display: "block", textDecoration: "none", width: "100%" }}
            >
              <Button
                color="inherit"
                component="span"
                fullWidth
                size="large"
                startIcon={<LoginRoundedIcon />}
                sx={{
                  borderColor: "#d7dce3",
                  borderRadius: 0,
                  minHeight: 52,
                  textTransform: "none",
                }}
                variant="outlined"
              >
                Войти в компанию
              </Button>
            </Link>
          </Stack>
        </Paper>

        <Chip
          label="После входа откроется /dashboard"
          sx={{ borderRadius: 0, fontWeight: 600 }}
          variant="outlined"
        />
      </Stack>
    </AuthPageShell>
  );
}
