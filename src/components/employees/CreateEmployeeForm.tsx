import { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type {
  DashboardEmployee,
  DashboardEmployeeSex,
} from "@/components/employees/employees-data";

type CreateEmployeeFormProps = Readonly<{
  onCreateEmployee: (employee: Omit<DashboardEmployee, "id">) => void;
  onCancel: () => void;
}>;

type CreateEmployeeValues = {
  age: string;
  date: string;
  email: string;
  isWorking: boolean;
  name: string;
  phone: string;
  role: string;
  sex: DashboardEmployeeSex;
};

const initialValues: CreateEmployeeValues = {
  age: "",
  date: "",
  email: "",
  isWorking: true,
  name: "",
  phone: "",
  role: "",
  sex: "Female",
};

export function CreateEmployeeForm({
  onCreateEmployee,
  onCancel,
}: CreateEmployeeFormProps) {
  const [values, setValues] = useState<CreateEmployeeValues>(initialValues);

  const handleChange =
    (field: keyof CreateEmployeeValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue =
        field === "isWorking" ? event.target.checked : event.target.value;

      setValues((currentValues) => ({
        ...currentValues,
        [field]: nextValue,
      }));
    };

  const handleSexChange = (event: SelectChangeEvent<DashboardEmployeeSex>) => {
    setValues((currentValues) => ({
      ...currentValues,
      sex: event.target.value as DashboardEmployeeSex,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onCreateEmployee({
      age: Number(values.age),
      avatar: values.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join(""),
      date: values.date,
      email: values.email.trim(),
      isWorking: values.isWorking,
      name: values.name.trim(),
      phone: values.phone.trim(),
      role: values.role.trim(),
      sex: values.sex,
    });

    setValues(initialValues);
  };

  return (
    <Card
      component="form"
      onSubmit={handleSubmit}
      sx={{
        border: 1,
        borderColor: "white",
        borderRadius: 0,
        px: { xs: 2.5, md: 3 },
        py: { xs: 2.5, md: 3 },
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ alignItems: { xs: "flex-start", md: "center" } }}
        >
          <Stack spacing={0.75} sx={{ flex: 1 }}>
            <Typography color="text.secondary" variant="subtitle2">
              User onboarding
            </Typography>
            <Typography sx={{ fontWeight: 600 }} variant="h5">
              Создание пользователя
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Заполни поля и новый сотрудник появится в таблице на первой
              вкладке.
            </Typography>
          </Stack>

          <Chip
            label={values.isWorking ? "Активный сотрудник" : "Неактивный"}
            size="small"
            sx={{
              borderRadius: 999,
              bgcolor: values.isWorking
                ? "rgba(34, 197, 94, 0.12)"
                : "rgba(148, 163, 184, 0.18)",
              color: values.isWorking ? "#15803d" : "#475569",
              fontWeight: 700,
            }}
          />
        </Stack>

        <Stack
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          <TextField
            fullWidth
            label="Full name"
            name="name"
            onChange={handleChange("name")}
            required
            value={values.name}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            onChange={handleChange("email")}
            required
            type="email"
            value={values.email}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            onChange={handleChange("phone")}
            required
            value={values.phone}
          />
          <TextField
            fullWidth
            label="Role"
            name="role"
            onChange={handleChange("role")}
            required
            value={values.role}
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            onChange={handleChange("age")}
            required
            slotProps={{ htmlInput: { min: 18 } }}
            type="number"
            value={values.age}
          />
          <TextField
            fullWidth
            label="Start date"
            name="date"
            onChange={handleChange("date")}
            required
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={values.date}
          />
          <FormControl fullWidth>
            <InputLabel id="employee-sex-label">Sex</InputLabel>
            <Select
              label="Sex"
              labelId="employee-sex-label"
              onChange={handleSexChange}
              value={values.sex}
            >
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
            </Select>
          </FormControl>

          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 3,
              borderStyle: "dashed",
              px: 2,
              py: 1.5,
            }}
            variant="outlined"
          >
            <Stack spacing={0.5}>
              <Typography sx={{ fontWeight: 600 }} variant="body2">
                Доступ к рабочему месту
              </Typography>
              <Typography color="text.secondary" variant="caption">
                Включи статус, если пользователь должен сразу попасть в активные.
              </Typography>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={values.isWorking}
                  onChange={handleChange("isWorking")}
                />
              }
              label={values.isWorking ? "Active" : "Offline"}
              labelPlacement="start"
              sx={{ m: 0 }}
            />
          </Card>
        </Stack>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "flex-end" }}
        >
          <Button color="inherit" onClick={onCancel} variant="outlined">
            К таблице
          </Button>
          <Button type="submit" variant="contained">
            Создать пользователя
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
