export type DashboardEmployeeSex = "Male" | "Female";

export type DashboardEmployee = {
  avatar?: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  date: string;
  isWorking: boolean;
  age: number;
  sex: DashboardEmployeeSex;
};

export const dashboardEmployees: ReadonlyArray<DashboardEmployee> = [
  {
    avatar: "AK",
    id: "EMP-1001",
    name: "Ariana Kim",
    email: "ariana.kim@clientcrm.io",
    phone: "+1 (202) 555-0189",
    role: "Chief Executive",
    date: "Jan 16, 2026",
    isWorking: true,
    age: 34,
    sex: "Female",
  },
  {
    avatar: "MR",
    id: "EMP-1002",
    name: "Marcus Reed",
    email: "marcus.reed@clientcrm.io",
    phone: "+1 (202) 555-0114",
    role: "Operations Lead",
    date: "Feb 03, 2026",
    isWorking: true,
    age: 41,
    sex: "Male",
  },
  {
    avatar: "SP",
    id: "EMP-1003",
    name: "Sophia Patel",
    email: "sophia.patel@clientcrm.io",
    phone: "+1 (202) 555-0138",
    role: "Finance Manager",
    date: "Feb 24, 2026",
    isWorking: true,
    age: 29,
    sex: "Female",
  },
  {
    avatar: "JT",
    id: "EMP-1004",
    name: "Jordan Tran",
    email: "jordan.tran@clientcrm.io",
    phone: "+1 (202) 555-0156",
    role: "Product Designer",
    date: "Mar 11, 2026",
    isWorking: false,
    age: 27,
    sex: "Male",
  },
  {
    avatar: "EL",
    id: "EMP-1005",
    name: "Emma Lopez",
    email: "emma.lopez@clientcrm.io",
    phone: "+1 (202) 555-0172",
    role: "HR Partner",
    date: "Apr 01, 2026",
    isWorking: true,
    age: 32,
    sex: "Female",
  },
  {
    avatar: "DK",
    id: "EMP-1006",
    name: "Daniel Kim",
    email: "daniel.kim@clientcrm.io",
    phone: "+1 (202) 555-0107",
    role: "Sales Manager",
    date: "Apr 14, 2026",
    isWorking: true,
    age: 36,
    sex: "Male",
  },
  {
    avatar: "NB",
    id: "EMP-1007",
    name: "Nina Brooks",
    email: "nina.brooks@clientcrm.io",
    phone: "+1 (202) 555-0146",
    role: "Account Lead",
    date: "Apr 23, 2026",
    isWorking: true,
    age: 30,
    sex: "Female",
  },
  {
    avatar: "TW",
    id: "EMP-1008",
    name: "Theo Walker",
    email: "theo.walker@clientcrm.io",
    phone: "+1 (202) 555-0194",
    role: "Support Lead",
    date: "May 02, 2026",
    isWorking: false,
    age: 39,
    sex: "Male",
  },
  {
    avatar: "LC",
    id: "EMP-1009",
    name: "Lila Chen",
    email: "lila.chen@clientcrm.io",
    phone: "+1 (202) 555-0128",
    role: "Customer Success",
    date: "May 06, 2026",
    isWorking: true,
    age: 28,
    sex: "Female",
  },
];
