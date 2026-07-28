import { HiOutlineHome, HiOutlineUsers, HiOutlineUserGroup, HiOutlineUserCircle, HiOutlineLink } from "react-icons/hi2";

/**
 * Sidebar navigation items: title, link, icon, optional end (exact path match for NavLink)
 */
export const sidebarMenu = [
  {
    title: "Home",
    link: "/",
    icon: HiOutlineHome,
    end: true,
  },
  {
    title: "Users",
    link: "/users",
    icon: HiOutlineUserGroup,
    end: true,
  },
  {
    title: "Payroll",
    link: "/payroll",
    icon: HiOutlineLink,
    end: true,
  },
  {
    title: "Subscriber",
    link: "/subscriber",
    icon: HiOutlineUsers,
    end: true,
  },
  // {
  //   title: "Profile",
  //   link: "/profile",
  //   icon: HiOutlineUserCircle,
  //   end: true,
  // },
];
