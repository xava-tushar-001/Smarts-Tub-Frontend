import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineUserCircle, HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";

/**
 * Sidebar navigation items: title, link, icon, optional end (exact path match for NavLink)
 */
export const sidebarMenu = [
  {
    title: "Home",
    link: "/home",
    icon: HiOutlineHome,
    end: true,
  },
  {
    title: "Salary Slips",
    link: "/salary-slips",
    icon: HiOutlineDocumentMagnifyingGlass,
    end: false,
  },
  {
    title: "Profile",
    link: "/profile",
    icon: HiOutlineUserCircle,
    end: true,
  },
];
