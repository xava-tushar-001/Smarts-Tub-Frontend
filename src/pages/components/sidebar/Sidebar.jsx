import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineArrowRightOnRectangle, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { sidebarMenu } from "./sidebarMenu";
import MianLogo from "../../../assets/logo.webp";
import { Link } from "react-router-dom";

const linkClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700";

const activeClass = "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  return (
    <aside
      className={`flex h-full min-h-0 shrink-0 flex-col overflow-hidden bg-white shadow-lg shadow-slate-200/50 transition-[width] duration-300 ease-in-out ${open ? "w-64" : "w-[4.75rem]"
        }`}
    >
      {/* Header Section with Logo */}
      <div
        className={`flex min-h-[4.5rem] items-center border-b border-slate-100 px-3 py-4 ${open ? "justify-between gap-2" : "justify-center"
          }`}
      >
        {open && (
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 truncate pl-1">
            <div className="flex h-12 w-12 items-center justify-center">
              <img src={MianLogo} alt="logo" className="h-5 w-auto" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-800">SmartStub</span>
              <span className="text-[10px] font-mono text-slate-400">Users Panel</span>
            </div>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
        >
          {open ? (
            <HiOutlineChevronLeft className="h-4 w-4" aria-hidden />
          ) : (
            <HiOutlineChevronRight className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
        {sidebarMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.link}
              to={item.link}
              end={item.end === true}
              title={!open ? item.title : undefined}
              className={({ isActive }) =>
                `${linkClass} ${!open ? "justify-center px-2" : ""} ${isActive ? activeClass : ""
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {open && <span className="truncate">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - Logout Section */}
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
  );
}