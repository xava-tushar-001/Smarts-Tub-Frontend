import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Sidebar } from "../pages/components/sidebar";
import logo from "../assets/logo.webp";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-white">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <HiOutlineBars3 className="h-5 w-5" aria-hidden />
          </button>
          <img src={logo} alt="SmartHub" className="h-6 w-auto" />
          <span className="text-sm font-bold tracking-tight text-slate-800">SmartHub</span>
        </div>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
