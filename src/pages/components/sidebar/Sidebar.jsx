import { useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
  HiOutlineSparkles,
  HiOutlineXMark,
} from "react-icons/hi2";
import { sidebarMenu } from "./sidebarMenu";
import { GetBillingStatus } from "../../../api/api_client";
import MainLogo from "../../../assets/mainicon.png"

const linkClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-[#eef2df] hover:text-[#17352a]";

const activeClass = "bg-[#eef2df] text-[#17352a] hover:bg-[#e4ead0] hover:text-[#17352a]";

export default function Sidebar({ mobileOpen = false, onCloseMobile = () => { } }) {
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(true);

  useEffect(() => {
    GetBillingStatus()
      .then((res) => setIsPaid((res.data?.body?.plan ?? "paid") === "paid"))
      .catch(() => { });
  }, []);

  function handleLogout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  function handleNavClick() {
    onCloseMobile();
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onCloseMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col overflow-hidden bg-white shadow-xl shadow-slate-300/40 transition-transform duration-300 ease-in-out md:relative md:z-auto md:w-64 md:translate-x-0 md:shadow-none md:border-r md:border-slate-100 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex min-h-[4.5rem] shrink-0 items-center justify-between gap-2 px-5 py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white">
              <img
                src={MainLogo}
                alt="Logo"
                className="object-contain"
              />
            </div>
            <span className="truncate text-lg font-bold tracking-tight text-slate-900">SmartStub</span>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 md:hidden"
          >
            <HiOutlineXMark className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav className="flex min-h-0 flex-col gap-1 overflow-y-auto px-3">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.link}
                to={item.link}
                end={item.end === true}
                onClick={handleNavClick}
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="min-h-0 flex-1" />

        {!isPaid && (
          <div className="mx-3 mb-4 rounded-2xl bg-[#17352a] p-4 text-white">
            <HiOutlineSparkles className="h-5 w-5 text-[#d6e17e]" aria-hidden />
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#d6e17e]">SmartStub Pro</p>
            <p className="mt-1 text-sm leading-snug text-white/75">
              Unlock more monthly uploads and full payslip history.
            </p>
            <Link
              to="/billing"
              onClick={handleNavClick}
              className="mt-3 block rounded-lg bg-[#d6e17e] px-3 py-2 text-center text-sm font-semibold text-[#17352a] transition hover:bg-[#cbd66c]"
            >
              Manage plan
            </Link>
          </div>
        )}

        <div className="shrink-0 space-y-1 border-t border-slate-100 p-3">
          <NavLink
            to="/profile"
            onClick={handleNavClick}
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            <HiOutlineCog6Tooth className="h-5 w-5 shrink-0" aria-hidden />
            <span className="truncate">Settings</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5 shrink-0" aria-hidden />
            <span className="truncate">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
