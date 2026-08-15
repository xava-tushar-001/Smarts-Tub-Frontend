import { useEffect, useRef, useState } from "react";
import { HiOutlineChevronDown, HiOutlineCheck } from "react-icons/hi2";
import { TICKET_STATUS_STYLES } from "./statusBadge";

const STATUS_OPTIONS = ["pending", "open", "resolved"];

export function StatusDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const current = TICKET_STATUS_STYLES[value] ?? TICKET_STATUS_STYLES.pending;
  const CurrentIcon = current.icon;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${current.badge}`}
      >
        <CurrentIcon className="h-3.5 w-3.5" aria-hidden />
        {current.label}
        <HiOutlineChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-10 mt-1.5 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {STATUS_OPTIONS.map((s) => {
            const style = TICKET_STATUS_STYLES[s];
            const Icon = style.icon;
            const selected = s === value;
            return (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                  selected ? "font-semibold text-slate-800" : "text-slate-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                <span className="flex-1">{style.label}</span>
                {selected && <HiOutlineCheck className="h-3.5 w-3.5 text-indigo-600" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
