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
  CreateEmployeeBody,
  EmployeeRole,
  EmployeeSex,
} from "@/lib/api/types/employee.types";

type CreateEmployeeFormProps = Readonly<{
  isSubmitting?: boolean;
  onCreateEmployee: (employee: CreateEmployeeBody) => Promise<void> | void;
  onCancel: () => void;
}>;

type CreateEmployeeValues = {
  age: string;
  email: string;
  isWorking: boolean;
  name: string;
  password: string;
  phone: string;
  role: EmployeeRole;
  sex: EmployeeSex;
  startDate: string;
};

const initialValues: CreateEmployeeValues = {
  age: "",
  email: "",
  isWorking: true,
  name: "",
  password: "",
  phone: "",
  role: "user",
  sex: "female",
  startDate: "",
};

export function CreateEmployeeForm({
  isSubmitting = false,
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

  const handleRoleChange = (event: SelectChangeEvent<EmployeeRole>) => {
    setValues((currentValues) => ({
      ...currentValues,
      role: event.target.value as EmployeeRole,
    }));
  };

  const handleSexChange = (event: SelectChangeEvent<EmployeeSex>) => {
    setValues((currentValues) => ({
      ...currentValues,
      sex: event.target.value as EmployeeSex,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await onCreateEmployee({
        age: Number(values.age),
        avatarUrl: null,
        email: values.email.trim(),
        isWorking: values.isWorking,
        name: values.name.trim(),
        password: values.password,
        phone: values.phone.trim(),
        role: values.role,
        sex: values.sex,
        startDate: values.startDate,
      });

      setValues(initialValues);
    } catch {
      return;
    }
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
            disabled={isSubmitting}
            fullWidth
            label="Full name"
            name="name"
            onChange={handleChange("name")}
            required
            value={values.name}
          />
          <TextField
            disabled={isSubmitting}
            fullWidth
            label="Email"
            name="email"
            onChange={handleChange("email")}
            required
            type="email"
            value={values.email}
          />
          <TextField
            disabled={isSubmitting}
            fullWidth
            label="Phone"
            name="phone"
            onChange={handleChange("phone")}
            required
            value={values.phone}
          />
          <TextField
            disabled={isSubmitting}
            fullWidth
            label="Password"
            name="password"
            onChange={handleChange("password")}
            required
            type="password"
            value={values.password}
          />
          <TextField
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            fullWidth
            label="Start date"
            name="startDate"
            onChange={handleChange("startDate")}
            required
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={values.startDate}
          />
          <FormControl fullWidth>
            <InputLabel id="employee-role-label">Role</InputLabel>
            <Select
              disabled={isSubmitting}
              label="Role"
              labelId="employee-role-label"
              onChange={handleRoleChange}
              value={values.role}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="employee-sex-label">Sex</InputLabel>
            <Select
              disabled={isSubmitting}
              label="Sex"
              labelId="employee-sex-label"
              onChange={handleSexChange}
              value={values.sex}
            >
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="male">Male</MenuItem>
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
                  disabled={isSubmitting}
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
          <Button
            color="inherit"
            disabled={isSubmitting}
            onClick={onCancel}
            variant="outlined"
          >
            К таблице
          </Button>
          <Button disabled={isSubmitting} type="submit" variant="contained">
            {isSubmitting ? "Создаём..." : "Создать пользователя"}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
