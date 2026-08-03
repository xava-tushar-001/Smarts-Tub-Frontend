import {
  HiOutlineSquares2X2,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineCreditCard,
  HiOutlineChartBar,
  HiOutlineLink,
  HiOutlineLifebuoy,
} from "react-icons/hi2";

/**
 * Sidebar navigation items: title, link, icon, optional end (exact path match for NavLink)
 */
export const sidebarMenu = [
  {
    title: "Overview",
    link: "/home",
    icon: HiOutlineSquares2X2,
    end: true,
  },
  {
    title: "Salary Slips",
    link: "/salary-slips",
    icon: HiOutlineDocumentMagnifyingGlass,
    end: false,
  },
  {
    title: "Earnings",
    link: "/earnings",
    icon: HiOutlineChartBar,
    end: true,
  },
  // {
  //   title: "Connect Payroll",
  //   link: "/payroll",
  //   icon: HiOutlineLink,
  //   end: true,
  // },
  {
    title: "Billing",
    link: "/billing",
    icon: HiOutlineCreditCard,
    end: true,
  },
  {
    title: "Support",
    link: "/support",
    icon: HiOutlineLifebuoy,
    end: false,
  },
];
