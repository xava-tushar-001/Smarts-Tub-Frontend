import { HiOutlineClock, HiOutlineChatBubbleLeftRight, HiOutlineCheckCircle } from "react-icons/hi2";

export const TICKET_STATUS_STYLES = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: HiOutlineClock,
  },
  open: {
    label: "Open",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: HiOutlineChatBubbleLeftRight,
  },
  resolved: {
    label: "Resolved",
    badge: "bg-green-50 text-green-700 border-green-200",
    icon: HiOutlineCheckCircle,
  },
};

export function TicketStatusBadge({ status, size = "sm" }) {
  const style = TICKET_STATUS_STYLES[status] ?? TICKET_STATUS_STYLES.pending;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.badge}`}
    >
      <Icon className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
      {style.label}
    </span>
  );
}
