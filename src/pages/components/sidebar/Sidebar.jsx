import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineArrowRightOnRectangle, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { sidebarMenu } from "./sidebarMenu";

const linkClass =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black/70 transition hover:bg-black/[0.04] hover:text-black";

const activeClass = "bg-[#EA2859]/10 text-[#EA2859] hover:bg-[#EA2859]/15 hover:text-[#EA2859]";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  return (
    <aside
      className={`flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-black/10 bg-white transition-[width] duration-200 ease-out ${
        open ? "w-56" : "w-[4.5rem]"
      }`}
    >
      <div
        className={`flex min-h-[4.25rem] items-center border-b border-black/10 px-2 py-4 ${
          open ? "justify-between gap-2" : "justify-center"
        }`}
      >
        {open && (
          <span className="min-w-0 truncate pl-2 text-lg font-semibold tracking-tight text-black">
            <span className="text-[#EA2859]">Smart</span>Hub
          </span>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 text-black/70 transition hover:bg-black/[0.04] hover:text-black"
        >
          {open ? (
            <HiOutlineChevronLeft className="h-5 w-5" aria-hidden />
          ) : (
            <HiOutlineChevronRight className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {sidebarMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.link}
              to={item.link}
              end={item.end === true}
              title={item.title}
              className={({ isActive }) =>
                `${linkClass} ${!open ? "justify-center px-2" : ""} ${isActive ? activeClass : ""}`
              }
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" />
              {open ? <span className="truncate">{item.title}</span> : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-black/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black/70 transition hover:bg-[#EA2859]/10 hover:text-[#EA2859] ${!open ? "justify-center px-2" : ""}`}
        >
          <HiOutlineArrowRightOnRectangle className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
          {open ? <span className="truncate">Log out</span> : null}
        </button>
      </div>
    </aside>
  );
}
