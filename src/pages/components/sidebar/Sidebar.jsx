import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
} from "react-icons/hi2";
import { sidebarMenu } from "./sidebarMenu";
import MianLogo from "../../../assets/logo.webp";

const linkClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700";

const activeClass = "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700";

export default function Sidebar({ mobileOpen = false, onCloseMobile = () => { } }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col overflow-hidden bg-white shadow-xl shadow-slate-300/40 transition-transform duration-300 ease-in-out md:relative md:z-auto md:translate-x-0 md:shadow-lg md:shadow-slate-200/50 md:transition-[width] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${open ? "md:w-64" : "md:w-[4.75rem]"}`}
      >
        <div
          className={`flex min-h-[4.5rem] shrink-0 items-center border-b border-slate-100 px-3 py-4 ${open ? "justify-between gap-2" : "justify-center"
            }`}
        >
          {open && (
            <Link to="/" className="flex min-w-0 items-center gap-2 truncate pl-1">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                <img src={MianLogo} alt="logo" className="h-5 w-auto" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-800">SmartStub</span>
                <span className="text-[10px] font-mono text-slate-400">Users Panel</span>
              </div>
            </Link>
          )}

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 md:flex"
          >
            {open ? (
              <HiOutlineChevronLeft className="h-4 w-4" aria-hidden />
            ) : (
              <HiOutlineChevronRight className="h-4 w-4" aria-hidden />
            )}
          </button>

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

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.link}
                to={item.link}
                end={item.end === true}
                title={!open ? item.title : undefined}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `${linkClass} ${!open ? "justify-center px-2" : ""} ${isActive ? activeClass : ""}`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {open && <span className="truncate">{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            title={!open ? "Log out" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${!open ? "justify-center px-2" : ""
              }`}
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5 shrink-0" aria-hidden />
            {open && <span className="truncate">Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
