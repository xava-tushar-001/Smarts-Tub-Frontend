import { createBrowserRouter } from "react-router-dom";
import Public from "./Public";
import Protected from "./Protected";
import WildcardRedirect from "./WildcardRedirect";
import MainLayout from "./Layout";
import Login from "../pages/login/Login";
import Home from "../pages/Home";
import Subscriber from "../pages/subscriber/Subscriber";

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
          { path: "/subscriber", element: <Subscriber /> },
        ],
      },
    ],
  },
  { path: "*", element: <WildcardRedirect /> },
]);