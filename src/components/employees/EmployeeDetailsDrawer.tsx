import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { DashboardEmployee } from "@/components/employees/employees-data";
import { getEmployeeAvatar } from "@/components/employees/employee-utils";

type EmployeeDetailsDrawerProps = Readonly<{
  employee: DashboardEmployee | null;
  onClose: () => void;
  open: boolean;
}>;

type EmployeeDetailItemProps = Readonly<{
  iconBgColor?: string;
  iconColor?: string;
  icon: React.ReactNode;
  label: string;
  valueColor?: string;
  value: string;
}>;

function EmployeeDetailItem({
  iconBgColor = "rgba(26, 115, 232, 0.08)",
  iconColor = "primary.main",
  icon,
  label,
  valueColor = "text.primary",
  value,
}: EmployeeDetailItemProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: "auto minmax(0, 1fr)",
        alignItems: "start",
        border: 1,
        borderColor: "divider",
        px: 1.75,
        py: 1.5,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: iconBgColor,
          color: iconColor,
        }}
      >
        {icon}
      </Box>

      <Stack spacing={0.35} sx={{ minWidth: 0 }}>
        <Typography color="text.secondary" variant="caption">
          {label}
        </Typography>
        <Typography
          sx={{ color: valueColor, fontWeight: 600, wordBreak: "break-word" }}
          variant="body2"
        >
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}

export function EmployeeDetailsDrawer({
  employee,
  onClose,
  open,
}: EmployeeDetailsDrawerProps) {
  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 430 },
          maxWidth: "100%",
        },
      }}
    >
      {employee ? (
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{
              px: { xs: 2.5, sm: 3 },
              py: { xs: 2.5, sm: 3 },
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <Typography color="text.secondary" variant="subtitle2">
                  Полный профиль
                </Typography>
                <Typography sx={{ mt: 0.75, fontWeight: 700 }} variant="h5">
                  Сотрудник
                </Typography>
              </Box>

              <IconButton aria-label="Закрыть профиль" onClick={onClose}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>

            <Stack spacing={2.5} sx={{ mt: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "flex-start" }}
              >
                <Avatar
                  src={employee.avatarUrl ?? undefined}
                  sx={{
                    bgcolor: "primary.main",
                    width: 72,
                    height: 72,
                    fontSize: 26,
                    fontWeight: 800,
                  }}
                >
                  {getEmployeeAvatar(employee)}
                </Avatar>

                <Stack spacing={1} sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }} variant="h5">
                    {employee.name}
                  </Typography>

                  <Stack
                    direction="row"
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    <Chip
                      label={employee.role}
                      size="small"
                      sx={{ borderRadius: 999, fontWeight: 700 }}
                    />
                    <Chip
                      icon={<FiberManualRecordRoundedIcon />}
                      label={employee.isWorking ? "Active now" : "Offline now"}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        bgcolor: employee.isWorking
                          ? "rgba(34, 197, 94, 0.14)"
                          : "rgba(148, 163, 184, 0.18)",
                        color: employee.isWorking ? "#15803d" : "#475569",
                        fontWeight: 700,
                      }}
                    />
                  </Stack>

                  <Typography color="text.secondary" variant="body2">
                    Employee ID: {employee.id}
                  </Typography>
                </Stack>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gap: 1.25,
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(26, 115, 232, 0.06)",
                    px: 1.75,
                    py: 1.5,
                  }}
                >
                  <Typography color="text.secondary" variant="caption">
                    Возраст
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }} variant="h6">
                    {employee.age}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    bgcolor:
                      employee.sex === "Female"
                        ? "rgba(244, 114, 182, 0.12)"
                        : "rgba(96, 165, 250, 0.14)",
                    px: 1.75,
                    py: 1.5,
                  }}
                >
                  <Typography color="text.secondary" variant="caption">
                    Пол
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }} variant="h6">
                    {employee.sex}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          <Divider />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: { xs: 2.5, sm: 3 },
              py: { xs: 2.5, sm: 3 },
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
                  Контактная информация
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
                  Все данные по сотруднику в одном месте.
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                <EmployeeDetailItem
                  icon={<EmailRoundedIcon fontSize="small" />}
                  label="Email"
                  value={employee.email}
                />
                <EmployeeDetailItem
                  icon={<PhoneRoundedIcon fontSize="small" />}
                  label="Телефон"
                  value={employee.phone}
                />
                <EmployeeDetailItem
                  icon={<WorkRoundedIcon fontSize="small" />}
                  label="Должность"
                  value={employee.role}
                />
                <EmployeeDetailItem
                  icon={<EventRoundedIcon fontSize="small" />}
                  label="Дата добавления"
                  value={employee.date}
                />
                <EmployeeDetailItem
                  icon={<FaceRoundedIcon fontSize="small" />}
                  label="Пол"
                  value={employee.sex}
                />
                <EmployeeDetailItem
                  icon={<FiberManualRecordRoundedIcon fontSize="small" />}
                  iconBgColor={
                    employee.isWorking
                      ? "rgba(34, 197, 94, 0.14)"
                      : "rgba(148, 163, 184, 0.18)"
                  }
                  iconColor={employee.isWorking ? "#15803d" : "#475569"}
                  label="Статус"
                  valueColor={employee.isWorking ? "#15803d" : "#475569"}
                  value={employee.isWorking ? "Active" : "Offline"}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      ) : null}
    </Drawer>
  );
}
