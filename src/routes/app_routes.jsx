import { createBrowserRouter } from "react-router-dom";
import Public from "./Public";
import Protected from "./Protected";
import WildcardRedirect from "./WildcardRedirect";
import MainLayout from "./Layout";
import Login from "../pages/login/Login";
import Home from "../pages/Home";
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
      { path: "/login", element: <Login /> }
    ],
  },
  {
    element: <Protected />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/home", element: <Home /> },
        ],
      },
    ],
  },
  { path: "*", element: <WildcardRedirect /> },
]);