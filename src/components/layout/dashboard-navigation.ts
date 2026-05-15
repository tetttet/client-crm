import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import ApiRoundedIcon from "@mui/icons-material/ApiRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

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
    icon: PeopleAltOutlinedIcon,
    label: "Employees",
  },
  {
    href: storageRoutes.root,
    icon: DriveFileMoveIcon,
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
    href: "/dashboard/finance",
    icon: AccountBalanceIcon,
    label: "Finance",
  },
  {
    href: "/dashboard/notes",
    icon: StickyNote2OutlinedIcon,
    label: "Notes",
  },
  {
    href: "/dashboard/chatbot",
    icon: MarkUnreadChatAltIcon,
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
