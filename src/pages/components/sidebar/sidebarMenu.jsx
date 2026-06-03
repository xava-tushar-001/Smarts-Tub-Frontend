import { HiOutlineHome, HiOutlineShoppingBag } from "react-icons/hi2";

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
    title: "Subscriber",
    link: "/subscriber",
    icon: HiOutlineShoppingBag,
    end: true,
  },
];
