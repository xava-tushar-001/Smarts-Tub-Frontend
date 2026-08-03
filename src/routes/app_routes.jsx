import { createBrowserRouter } from "react-router-dom";
import Public from "./Public";
import Protected from "./Protected";
import WildcardRedirect from "./WildcardRedirect";
import MainLayout from "./Layout";
import Login from "../pages/login/Login";
import Home from "../pages/Home";
import Subscriber from "../pages/subscriber/Subscriber";
import Users from "../pages/users/Users";
import UserDetail from "../pages/users/UserDetail";
import UserPayments from "../pages/users/UserPayments";
import UserSalarySlips from "../pages/users/UserSalarySlips";
import SalarySlipReview from "../pages/users/SalarySlipReview";
import PayrollConnections from "../pages/payroll/PayrollConnections";
import Profile from "../pages/profile/Profile";
import Tickets from "../pages/tickets/Tickets";
import TicketDetail from "../pages/tickets/TicketDetail";

export const router = createBrowserRouter([
  // {
  //   children: [
  //   ],
  // },
  {
    element: <Public />,
    children: [
      { path: "/login", element: <Login /> }
    ],
  },
  {
    element: <Protected />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/users", element: <Users /> },
          { path: "/users/:id", element: <UserDetail /> },
          { path: "/users/:id/payments", element: <UserPayments /> },
          { path: "/users/:id/salary-slips", element: <UserSalarySlips /> },
          { path: "/users/:id/salary-slips/:slipId", element: <SalarySlipReview /> },
          { path: "/payroll", element: <PayrollConnections /> },
          { path: "/subscriber", element: <Subscriber /> },
          { path: "/tickets", element: <Tickets /> },
          { path: "/tickets/:id", element: <TicketDetail /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
    ],
  },
  { path: "*", element: <WildcardRedirect /> },
]);