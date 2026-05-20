import Link from "next/link";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { DashboardThemeProvider } from "@/components/layout/dashboard-theme-provider";

type AuthPageShellProps = Readonly<{
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}>;

const infoCardSx = {
  background:
    "linear-gradient(180deg, rgba(26,115,232,0.08) 0%, rgba(255,255,255,0.96) 100%)",
  border: "1px solid #d7dce3",
  borderRadius: 0,
  minHeight: { md: 560 },
  overflow: "hidden",
  p: { xs: 3, md: 4 },
  position: "relative",
};

const contentCardSx = {
  border: "1px solid #d7dce3",
  borderRadius: 0,
  minHeight: { md: 560 },
  p: { xs: 3, md: 4 },
};

export function AuthPageShell({
  children,
  description,
  eyebrow,
  title,
}: AuthPageShellProps) {
  return (
    <DashboardThemeProvider>
      <Box
        sx={{
          background:
            "radial-gradient(circle at top left, rgba(26,115,232,0.14), transparent 32%), linear-gradient(180deg, #f7f9fc 0%, #eef3f9 100%)",
          minHeight: "100vh",
          py: { xs: 4, md: 7 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2.5}>
            <Box>
              <Link
                href="/"
                style={{
                  color: "inherit",
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                <Button
                  color="inherit"
                  component="span"
                  startIcon={<ArrowBackRoundedIcon />}
                  sx={{
                    borderRadius: 0,
                    color: "text.secondary",
                    px: 0,
                    textTransform: "none",
                  }}
                >
                  На главную
                </Button>
              </Link>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 2.5,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(320px, 0.95fr) minmax(0, 1.05fr)",
                },
              }}
            >
              <Paper sx={infoCardSx}>
                <Stack
                  spacing={3}
                  sx={{
                    height: "100%",
                    justifyContent: "space-between",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Stack spacing={2}>
                    <Chip
                      label="Frontend + Backend Ready"
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        borderRadius: 0,
                        fontWeight: 700,
                      }}
                    />

                    <Box>
                      <Typography color="text.secondary" variant="subtitle2">
                        {eyebrow}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "2rem", md: "2.6rem" },
                          fontWeight: 700,
                          letterSpacing: "-0.03em",
                          mt: 1,
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ maxWidth: 420, mt: 1.5 }}
                        variant="body1"
                      >
                        {description}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={1.5}>
                    <Paper
                      sx={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #d7dce3",
                        borderRadius: 0,
                        p: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: 700 }} variant="body2">
                        Backend URL
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        `NEXT_PUBLIC_API_URL=http://localhost:8080`
                      </Typography>
                    </Paper>

                    <Paper
                      sx={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #d7dce3",
                        borderRadius: 0,
                        p: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: 700 }} variant="body2">
                        После успешной авторизации
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Пользователь будет переведён в dashboard CRM на
                        `/dashboard`.
                      </Typography>
                    </Paper>
                  </Stack>
                </Stack>
              </Paper>

              <Paper sx={contentCardSx}>{children}</Paper>
            </Box>
          </Stack>
        </Container>
      </Box>
    </DashboardThemeProvider>
  );
}
