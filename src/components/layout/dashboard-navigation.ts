import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';

export type DashboardNavigationItem = {
  href: string;
  icon: typeof HomeRoundedIcon;
  label: string;
};

export const dashboardNavigationItems: DashboardNavigationItem[] = [
  {
    href: "/dashboard",
    icon: HomeRoundedIcon,
    label: "Главная",
  },
  {
    href: "/dashboard/employees",
    icon: PeopleAltOutlinedIcon,
    label: "Сотрудники",
  },
  {
    href: "/dashboard/finance",
    icon: AccountBalanceIcon,
    label: "Финансы",
  },
  {
    href: "/dashboard/notes",
    icon: StickyNote2OutlinedIcon,
    label: "Заметки",
  },
  {
    href: "/dashboard/chatbot",
    icon: MarkUnreadChatAltIcon,
    label: "ЧатБот",
  },
];

export function isDashboardPathActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function getDashboardPageTitle(pathname: string) {
  const activeItem =
    dashboardNavigationItems.find((item) =>
      isDashboardPathActive(pathname, item.href),
    ) ?? dashboardNavigationItems[0];

  return activeItem.label;
}
