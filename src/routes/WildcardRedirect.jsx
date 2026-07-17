import { Navigate } from "react-router-dom";

export default function WildcardRedirect() {
  const token = localStorage.getItem("token");
  return <Navigate to={token ? "/" : "/"} replace />;
}
