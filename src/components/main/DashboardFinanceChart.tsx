import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

type FinanceSlice = {
  id: number;
  label: string;
  value: number;
  color: string;
  trendLabel: string;
};

type ExpenseCategory = {
  id: number;
  label: string;
  value: number;
  color: string;
};

const financeData: ReadonlyArray<FinanceSlice> = [
  {
    id: 0,
    label: "Доходы",
    value: 128400,
    color: "#1b75d2",
    trendLabel: "+18.2%",
  },
  {
    id: 1,
    label: "Расходы",
    value: 76450,
    color: "#ef6c57",
    trendLabel: "+6.4%",
  },
];

const expenseCategories: ReadonlyArray<ExpenseCategory> = [
  {
    id: 0,
    label: "Зарплаты",
    value: 32400,
    color: "#1b75d2",
  },
  {
    id: 1,
    label: "Офис",
    value: 18600,
    color: "#8b5cf6",
  },
  {
    id: 2,
    label: "Маркетинг",
    value: 15200,
    color: "#f59e0b",
  },
  {
    id: 3,
    label: "Сервисы",
    value: 10250,
    color: "#10b981",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function DashboardFinanceChart() {
  const totalIncome = financeData[0].value;
  const totalExpenses = financeData[1].value;
  const balance = totalIncome - totalExpenses;
  const totalTurnover = totalIncome + totalExpenses;

  const incomeShare = Math.round((totalIncome / totalTurnover) * 100);
  const expenseShare = 100 - incomeShare;
  const profitMargin = Math.round((balance / totalIncome) * 100);

  const maxCategoryValue = Math.max(
    ...expenseCategories.map((category) => category.value),
  );

  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        height: "100%",
        flexDirection: "column",
        border: 1,
        borderColor: "white",
        borderRadius: 0,
        gap: 3,
        overflow: "hidden",
        px: { xs: 2.5, md: 3 },
        py: { xs: 2.5, md: 3 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography color="text.secondary" variant="subtitle2">
            Финансовый обзор
          </Typography>

          <Typography sx={{ mt: 0.75, fontWeight: 700 }} variant="h5">
            Доходы и расходы
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
            Сводка по текущему месяцу: оборот, прибыль и основные категории
            затрат
          </Typography>
        </Box>

        <Chip
          color={balance >= 0 ? "success" : "error"}
          label={`Баланс ${currencyFormatter.format(balance)}`}
          size="small"
          sx={{
            borderRadius: 999,
            fontWeight: 700,
            px: 0.75,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 250px) 1fr" },
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "grid",
              height: { xs: 220, sm: 250 },
              width: { xs: 220, sm: 250 },
              placeItems: "center",
              borderRadius: "50%",
              background: `conic-gradient(
                ${financeData[0].color} 0 ${incomeShare}%,
                ${financeData[1].color} ${incomeShare}% 100%
              )`,
              boxShadow:
                "inset 0 0 0 1px rgba(32,33,36,0.06), 0 24px 60px rgba(15,23,42,0.10)",
            }}
          >
            <Box
              sx={{
                display: "grid",
                height: { xs: 126, sm: 138 },
                width: { xs: 126, sm: 138 },
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "background.paper",
                textAlign: "center",
                boxShadow: "0 16px 38px rgba(15, 23, 42, 0.12)",
              }}
            >
              <Box>
                <Typography color="text.secondary" variant="caption">
                  Чистая прибыль
                </Typography>

                <Typography sx={{ mt: 0.25, fontWeight: 800 }} variant="h6">
                  {currencyFormatter.format(balance)}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    color: balance >= 0 ? "success.main" : "error.main",
                    fontWeight: 700,
                  }}
                  variant="caption"
                >
                  {profitMargin}% margin
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gap: 1.5 }}>
          {financeData.map((item) => {
            const isIncome = item.label === "Доходы";
            const Icon = isIncome
              ? TrendingUpRoundedIcon
              : TrendingDownRoundedIcon;

            const percent = isIncome ? incomeShare : expenseShare;

            return (
              <Box
                key={item.id}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "rgba(255,255,255,0.88)",
                  px: 2,
                  py: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        display: "grid",
                        height: 42,
                        width: 42,
                        placeItems: "center",
                        borderRadius: 2.5,
                        bgcolor: `${item.color}14`,
                        color: item.color,
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: 700 }} variant="body2">
                        {item.label}
                      </Typography>

                      <Typography color="text.secondary" variant="caption">
                        {currencyFormatter.format(item.value)}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={item.trendLabel}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      bgcolor: `${item.color}14`,
                      color: item.color,
                      fontWeight: 800,
                    }}
                  />
                </Box>

                <Box sx={{ mt: 1.5 }}>
                  <Box
                    sx={{
                      mb: 0.75,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography color="text.secondary" variant="caption">
                      Доля в обороте
                    </Typography>

                    <Typography sx={{ fontWeight: 700 }} variant="caption">
                      {percent}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      height: 7,
                      borderRadius: 999,
                      bgcolor: `${item.color}14`,
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        bgcolor: item.color,
                      },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            bgcolor: "rgba(255,255,255,0.78)",
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccountBalanceWalletRoundedIcon
              sx={{ color: "#1b75d2" }}
              fontSize="small"
            />
            <Typography color="text.secondary" variant="caption">
              Общий оборот
            </Typography>
          </Box>

          <Typography sx={{ mt: 0.75, fontWeight: 800 }} variant="body1">
            {currencyFormatter.format(totalTurnover)}
          </Typography>
        </Box>

        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            bgcolor: "rgba(255,255,255,0.78)",
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SavingsRoundedIcon sx={{ color: "#10b981" }} fontSize="small" />
            <Typography color="text.secondary" variant="caption">
              Маржинальность
            </Typography>
          </Box>

          <Typography sx={{ mt: 0.75, fontWeight: 800 }} variant="body1">
            {profitMargin}%
          </Typography>
        </Box>

        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            bgcolor: "rgba(255,255,255,0.78)",
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReceiptLongRoundedIcon
              sx={{ color: "#ef6c57" }}
              fontSize="small"
            />
            <Typography color="text.secondary" variant="caption">
              Расходы к доходам
            </Typography>
          </Box>

          <Typography sx={{ mt: 0.75, fontWeight: 800 }} variant="body1">
            {Math.round((totalExpenses / totalIncome) * 100)}%
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          border: 1,
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.82)",
          px: 2,
          py: 1.75,
        }}
      >
        <Box
          sx={{
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800 }} variant="body2">
              Основные расходы
            </Typography>

            <Typography color="text.secondary" variant="caption">
              Разбивка затрат по категориям
            </Typography>
          </Box>

          <Chip
            label="4 категории"
            size="small"
            sx={{
              borderRadius: 999,
              bgcolor: "rgba(27,117,210,0.10)",
              color: "#1b75d2",
              fontWeight: 700,
            }}
          />
        </Box>

        <Box sx={{ display: "grid", gap: 1.25 }}>
          {expenseCategories.map((category) => {
            const value = Math.round((category.value / maxCategoryValue) * 100);

            return (
              <Box key={category.id}>
                <Box
                  sx={{
                    mb: 0.65,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: category.color,
                      }}
                    />

                    <Typography sx={{ fontWeight: 600 }} variant="caption">
                      {category.label}
                    </Typography>
                  </Box>

                  <Typography color="text.secondary" variant="caption">
                    {currencyFormatter.format(category.value)}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={value}
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    bgcolor: `${category.color}14`,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      bgcolor: category.color,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}
