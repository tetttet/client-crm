"use client";

import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  style: "percent",
});

const monthData = [
  { expenses: 58200, income: 114000, month: "Jan", profit: 55800 },
  { expenses: 63800, income: 121500, month: "Feb", profit: 57700 },
  { expenses: 69200, income: 132400, month: "Mar", profit: 63200 },
  { expenses: 71400, income: 141800, month: "Apr", profit: 70400 },
  { expenses: 76450, income: 153200, month: "May", profit: 76750 },
  { expenses: 80100, income: 161900, month: "Jun", profit: 81800 },
];

const revenueRows = [
  { channel: "Retail orders", orders: 284, revenue: 72400, share: 0.45 },
  { channel: "Corporate clients", orders: 36, revenue: 51200, share: 0.32 },
  { channel: "Marketplace", orders: 148, revenue: 28600, share: 0.18 },
  { channel: "Subscriptions", orders: 41, revenue: 9700, share: 0.05 },
];

const expenseRows = [
  { amount: 32400, category: "Payroll", color: "#1976d2" },
  { amount: 18600, category: "Operations", color: "#2e7d32" },
  { amount: 15200, category: "Marketing", color: "#f9a825" },
  { amount: 10250, category: "Services", color: "#c62828" },
];

const cashFlowRows = [
  { balance: 24800, inflow: 42100, outflow: 17300, week: "Week 1" },
  { balance: 38200, inflow: 48600, outflow: 35200, week: "Week 2" },
  { balance: 44700, inflow: 51200, outflow: 44700, week: "Week 3" },
  { balance: 51950, inflow: 60100, outflow: 52850, week: "Week 4" },
];

const invoiceRows = [
  { amount: 18400, client: "Northwind Group", due: "May 22", status: "Due" },
  { amount: 12600, client: "Blue Ocean LLP", due: "May 24", status: "Draft" },
  { amount: 9400, client: "Metro Retail", due: "May 26", status: "Paid" },
  { amount: 7100, client: "Atlas Trade", due: "May 28", status: "Due" },
  { amount: 5200, client: "Prime Digital", due: "May 30", status: "Paid" },
];

const cardSx = {
  bgcolor: "#ffffff",
  border: "1px solid #d7dce3",
  borderRadius: 0,
  boxShadow: "none",
  minWidth: 0,
};

const tableSx = {
  minWidth: 520,
  "& .MuiTableCell-root": {
    borderColor: "#e8eff7",
    px: 2,
    py: 1.25,
  },
};

type FinanceMetricCardProps = Readonly<{
  color: string;
  helper: string;
  icon: typeof PaidRoundedIcon;
  label: string;
  value: string;
}>;

function FinanceMetricCard({
  color,
  helper,
  icon: Icon,
  label,
  value,
}: FinanceMetricCardProps) {
  return (
    <Paper
      sx={{
        ...cardSx,
        borderTop: `3px solid ${color}`,
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            alignItems: "center",
            bgcolor: `${color}14`,
            color,
            display: "flex",
            height: 42,
            justifyContent: "center",
            width: 42,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" variant="caption">
            {label}
          </Typography>
          <Typography sx={{ color: "#17324f", fontWeight: 800 }} variant="h6">
            {value}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {helper}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

type FinancePanelProps = Readonly<{
  actions?: React.ReactNode;
  children: React.ReactNode;
  label: string;
  title: string;
}>;

function FinancePanel({ actions, children, label, title }: FinancePanelProps) {
  return (
    <Paper sx={{ ...cardSx, overflow: "hidden" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{
          alignItems: { xs: "flex-start", md: "center" },
          borderBottom: "1px solid #d7dce3",
          justifyContent: "space-between",
          px: { xs: 2, md: 2.5 },
          py: 2,
        }}
      >
        <Stack spacing={0.35}>
          <Typography color="text.secondary" variant="caption">
            {label}
          </Typography>
          <Typography sx={{ color: "#17324f", fontWeight: 800 }} variant="h6">
            {title}
          </Typography>
        </Stack>
        {actions}
      </Stack>
      {children}
    </Paper>
  );
}

function StatusChip({ status }: Readonly<{ status: string }>) {
  const statusMeta =
    status === "Paid"
      ? { bgcolor: "#e6f4ea", color: "#137333" }
      : status === "Due"
        ? { bgcolor: "#fff8e1", color: "#8d6e00" }
        : { bgcolor: "#f1f3f4", color: "#5f6368" };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: statusMeta.bgcolor,
        border: "1px solid #d7dce3",
        borderRadius: 0,
        color: statusMeta.color,
        fontWeight: 800,
        height: 26,
      }}
      variant="outlined"
    />
  );
}

export default function FinancePage() {
  const currentMonth = monthData.at(-1) ?? monthData[0];
  const totalInvoices = invoiceRows.reduce((total, row) => total + row.amount, 0);
  const maxExpense = Math.max(...expenseRows.map((row) => row.amount));
  const paidInvoices = invoiceRows
    .filter((row) => row.status === "Paid")
    .reduce((total, row) => total + row.amount, 0);

  return (
    <Box sx={{ bgcolor: "#f5f7fb", pb: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Paper
          sx={{
            ...cardSx,
            borderTop: "3px solid #1976d2",
            p: { xs: 2.5, md: 3 },
          }}
        >
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "flex-start", lg: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={0.75} sx={{ maxWidth: 760 }}>
                <Typography
                  sx={{
                    bgcolor: "#e3f2fd",
                    border: "1px solid #90caf9",
                    borderRadius: 0,
                    color: "#1565c0",
                    display: "inline-flex",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0,
                    px: 1.25,
                    py: 0.5,
                    textTransform: "uppercase",
                    width: "fit-content",
                  }}
                >
                  Finance
                </Typography>
                <Typography sx={{ color: "#202124", fontWeight: 800 }} variant="h4">
                  Financial dashboard
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                  Revenue, expenses, cash flow, and invoice status in the same
                  compact MUI style as the storage screens.
                </Typography>
              </Stack>

              <Chip
                color="success"
                icon={<TrendingUpRoundedIcon fontSize="small" />}
                label={`Profit ${currencyFormatter.format(currentMonth.profit)}`}
                sx={{ borderRadius: 0, fontWeight: 800 }}
                variant="outlined"
              />
            </Stack>

            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  xl: "repeat(4, minmax(0, 1fr))",
                },
              }}
            >
              <FinanceMetricCard
                color="#1976d2"
                helper="+14.8% vs previous month"
                icon={PaidRoundedIcon}
                label="Revenue"
                value={currencyFormatter.format(currentMonth.income)}
              />
              <FinanceMetricCard
                color="#c62828"
                helper="49.5% expense ratio"
                icon={ReceiptLongRoundedIcon}
                label="Expenses"
                value={currencyFormatter.format(currentMonth.expenses)}
              />
              <FinanceMetricCard
                color="#2e7d32"
                helper="Operating result"
                icon={SavingsRoundedIcon}
                label="Net profit"
                value={currencyFormatter.format(currentMonth.profit)}
              />
              <FinanceMetricCard
                color="#f9a825"
                helper={`${invoiceRows.length} active invoices`}
                icon={AccountBalanceRoundedIcon}
                label="Invoices"
                value={currencyFormatter.format(totalInvoices)}
              />
            </Box>
          </Stack>
        </Paper>

        <FinancePanel
          actions={
            <Chip
              label="Large chart"
              sx={{ borderRadius: 0, fontWeight: 700 }}
              variant="outlined"
            />
          }
          label="Table 1"
          title="Monthly revenue and profit"
        >
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.45fr) 520px" },
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Box sx={{ minHeight: 340, minWidth: 0 }}>
              <LineChart
                grid={{ horizontal: true }}
                height={340}
                margin={{ bottom: 34, left: 64, right: 20, top: 20 }}
                series={[
                  {
                    color: "#1976d2",
                    data: monthData.map((row) => row.income),
                    label: "Revenue",
                  },
                  {
                    color: "#2e7d32",
                    data: monthData.map((row) => row.profit),
                    label: "Profit",
                  },
                ]}
                xAxis={[
                  {
                    data: monthData.map((row) => row.month),
                    scaleType: "point",
                  },
                ]}
              />
            </Box>

            <TableContainer sx={{ border: "1px solid #e8eff7" }}>
              <Table size="small" sx={tableSx}>
                <TableHead>
                  <TableRow>
                    {["Month", "Revenue", "Expenses", "Profit"].map((label) => (
                      <TableCell key={label}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthData.map((row) => (
                    <TableRow key={row.month} hover>
                      <TableCell sx={{ fontWeight: 800 }}>{row.month}</TableCell>
                      <TableCell>{currencyFormatter.format(row.income)}</TableCell>
                      <TableCell>{currencyFormatter.format(row.expenses)}</TableCell>
                      <TableCell sx={{ color: "#2e7d32", fontWeight: 800 }}>
                        {currencyFormatter.format(row.profit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </FinancePanel>

        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          <FinancePanel
            actions={
              <Chip
                label="Table 2"
                sx={{ borderRadius: 0, fontWeight: 700 }}
                variant="outlined"
              />
            }
            label="Revenue mix"
            title="Channels"
          >
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
              <BarChart
                height={240}
                margin={{ bottom: 68, left: 62, right: 16, top: 20 }}
                series={[
                  {
                    color: "#1976d2",
                    data: revenueRows.map((row) => row.revenue),
                    label: "Revenue",
                  },
                ]}
                xAxis={[
                  {
                    data: revenueRows.map((row) => row.channel),
                    scaleType: "band",
                  },
                ]}
              />

              <TableContainer sx={{ mt: 1.5 }}>
                <Table size="small" sx={{ ...tableSx, minWidth: 460 }}>
                  <TableHead>
                    <TableRow>
                      {["Channel", "Orders", "Share"].map((label) => (
                        <TableCell key={label}>{label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {revenueRows.map((row) => (
                      <TableRow key={row.channel} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{row.channel}</TableCell>
                        <TableCell>{row.orders}</TableCell>
                        <TableCell>{percentFormatter.format(row.share)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </FinancePanel>

          <FinancePanel
            actions={
              <Chip
                label="Table 3"
                sx={{ borderRadius: 0, fontWeight: 700 }}
                variant="outlined"
              />
            }
            label="Cost control"
            title="Expense categories"
          >
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
              <PieChart
                height={240}
                margin={{ bottom: 20, left: 20, right: 20, top: 20 }}
                series={[
                  {
                    data: expenseRows.map((row) => ({
                      color: row.color,
                      id: row.category,
                      label: row.category,
                      value: row.amount,
                    })),
                    innerRadius: 58,
                    outerRadius: 104,
                    paddingAngle: 2,
                  },
                ]}
              />

              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                {expenseRows.map((row) => (
                  <Box key={row.category}>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.75,
                      }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Box sx={{ bgcolor: row.color, height: 8, width: 8 }} />
                        <Typography sx={{ fontWeight: 700 }} variant="body2">
                          {row.category}
                        </Typography>
                      </Stack>
                      <Typography color="text.secondary" variant="body2">
                        {currencyFormatter.format(row.amount)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      value={(row.amount / maxExpense) * 100}
                      variant="determinate"
                      sx={{
                        bgcolor: `${row.color}14`,
                        height: 6,
                        "& .MuiLinearProgress-bar": {
                          bgcolor: row.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </FinancePanel>
        </Box>

        <FinancePanel
          actions={
            <Chip
              label={`${percentFormatter.format(paidInvoices / totalInvoices)} paid`}
              sx={{ borderRadius: 0, fontWeight: 700 }}
              variant="outlined"
            />
          }
          label="Table 4"
          title="Cash flow and invoices"
        >
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.35fr) 560px" },
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Box sx={{ minHeight: 330, minWidth: 0 }}>
              <BarChart
                height={330}
                margin={{ bottom: 38, left: 64, right: 20, top: 20 }}
                series={[
                  {
                    color: "#2e7d32",
                    data: cashFlowRows.map((row) => row.inflow),
                    label: "Inflow",
                  },
                  {
                    color: "#c62828",
                    data: cashFlowRows.map((row) => row.outflow),
                    label: "Outflow",
                  },
                ]}
                xAxis={[
                  {
                    data: cashFlowRows.map((row) => row.week),
                    scaleType: "band",
                  },
                ]}
              />
            </Box>

            <TableContainer sx={{ border: "1px solid #e8eff7" }}>
              <Table size="small" sx={{ ...tableSx, minWidth: 540 }}>
                <TableHead>
                  <TableRow>
                    {["Client", "Due", "Amount", "Status"].map((label) => (
                      <TableCell key={label}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceRows.map((row) => (
                    <TableRow key={row.client} hover>
                      <TableCell sx={{ fontWeight: 800 }}>{row.client}</TableCell>
                      <TableCell>{row.due}</TableCell>
                      <TableCell>{currencyFormatter.format(row.amount)}</TableCell>
                      <TableCell>
                        <StatusChip status={row.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </FinancePanel>
      </Stack>
    </Box>
  );
}
