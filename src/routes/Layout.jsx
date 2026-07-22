import { useEffect, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineBars3, HiOutlineBell, HiOutlineChevronDown } from "react-icons/hi2";
import { Sidebar } from "../pages/components/sidebar";
import { GetProfile } from "../api/api_client";

function initialsOf(name, email) {
  const source = (name || email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    GetProfile()
      .then((res) => setUser(res.data?.body?.user ?? null))
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-[#faf9f4]">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 bg-[#faf9f4] px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
          >
            <HiOutlineBars3 className="h-5 w-5" aria-hidden />
          </button>

          <p className="min-w-0 flex-1 truncate text-sm text-slate-500">Your financial workspace</p>

          {/* <button
            type="button"
            onClick={() => toast("You're all caught up!")}
            aria-label="Notifications"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <HiOutlineBell className="h-5 w-5" aria-hidden />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c1602f]" />
          </button> */}

          <Link
            to="/profile"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition hover:bg-slate-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3e2c9] text-xs font-semibold text-[#8a5a2b]">
              {initialsOf(user?.name, user?.email)}
            </span>
            <HiOutlineChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          </Link>
        </div>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
