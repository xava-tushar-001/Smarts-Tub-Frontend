import { createBrowserRouter } from "react-router-dom";
import Public from "./Public";
import Protected from "./Protected";
import WildcardRedirect from "./WildcardRedirect";
import MainLayout from "./Layout";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Home from "../pages/Home";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import SalarySlips from "../pages/salarySlips/SalarySlips";
import UploadSalarySlip from "../pages/salarySlips/UploadSalarySlip";
import SalarySlipDetail from "../pages/salarySlips/SalarySlipDetail";
import LandingPage from "../pages/LandingPage";

export const router = createBrowserRouter([
  {
    children: [
      { path: "/", element: <LandingPage /> },
    ],
  },
  {
    element: <Public />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> }
    ],
  },
  {
    element: <Protected />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/profile", element: <Profile /> },
          { path: "/profile/edit", element: <EditProfile /> },
          { path: "/salary-slips", element: <SalarySlips /> },
          { path: "/salary-slips/upload", element: <UploadSalarySlip /> },
          { path: "/salary-slips/:id", element: <SalarySlipDetail /> },
        ],
      },
    ],
  },
  { path: "*", element: <WildcardRedirect /> },
]);