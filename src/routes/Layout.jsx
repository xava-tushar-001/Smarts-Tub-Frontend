import { Outlet } from "react-router-dom";
import { Sidebar } from "../pages/components/sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-white">
      <Sidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}