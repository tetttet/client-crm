import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ApiRoundedIcon from "@mui/icons-material/ApiRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";

import { storageRoutes } from "@/features/storage/storage-routes";

export type DashboardNavigationSubItem = {
  href: string;
  icon: SvgIconComponent;
  label: string;
};

export type DashboardNavigationItem = {
  href: string;
  icon: SvgIconComponent;
  label: string;
  subItems?: DashboardNavigationSubItem[];
};

export const dashboardNavigationItems: DashboardNavigationItem[] = [
  {
    href: "/dashboard",
    icon: HomeRoundedIcon,
    label: "Home",
  },
  {
    href: "/dashboard/employees",
    icon: PeopleRoundedIcon,
    label: "Employees",
  },
  {
    href: storageRoutes.root,
    icon: Inventory2RoundedIcon,
    label: "Inventory",
    subItems: [
      {
        href: storageRoutes.createProduct,
        icon: AddBoxRoundedIcon,
        label: "Add Product",
      },
      {
        href: storageRoutes.listProducts,
        icon: FormatListBulletedRoundedIcon,
        label: "Product List",
      },
      {
        href: storageRoutes.categories,
        icon: CategoryRoundedIcon,
        label: "Categories",
      },
      {
        href: storageRoutes.productSettings,
        icon: SettingsRoundedIcon,
        label: "Product Settings",
      },
      {
        href: storageRoutes.productApi,
        icon: ApiRoundedIcon,
        label: "Product API",
      },
      {
        href: storageRoutes.apiDocumentation,
        icon: DescriptionRoundedIcon,
        label: "API Documentation",
      },
    ],
  },
  {
    href: "/dashboard/orders",
    icon: ReceiptLongRoundedIcon,
    label: "Orders",
  },
  {
    href: "/dashboard/finance",
    icon: AccountBalanceWalletRoundedIcon,
    label: "Finance",
  },
  {
    href: "/dashboard/notes",
    icon: StickyNote2RoundedIcon,
    label: "Notes",
  },
  {
    href: "/dashboard/company",
    icon: BusinessRoundedIcon,
    label: "Company Page",
  },
  {
    href: "/dashboard/chatbot",
    icon: SmartToyRoundedIcon,
    label: "Chatbot",
  },
];

export function isDashboardPathActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getDashboardPageTitle(pathname: string) {
  for (const item of dashboardNavigationItems) {
    const activeSubItem = item.subItems?.find((subItem) =>
      isDashboardPathActive(pathname, subItem.href),
    );

    if (activeSubItem) {
      return activeSubItem.label;
    }

    if (isDashboardPathActive(pathname, item.href)) {
      return item.label;
    }
  }

  return dashboardNavigationItems[0]?.label ?? "Dashboard";
}
