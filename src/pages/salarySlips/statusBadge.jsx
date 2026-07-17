import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
  HiOutlineClock,
} from "react-icons/hi2";

export const OVERALL_STYLES = {
  green: {
    label: "Passed",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 border-green-200",
    icon: HiOutlineCheckCircle,
  },
  orange: {
    label: "Warnings",
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    icon: HiOutlineExclamationTriangle,
  },
  red: {
    label: "Errors",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: HiOutlineXCircle,
  },
};

export function OverallBadge({ status, size = "sm" }) {
  if (status === "processing" || status === "failed") {
    const isFailed = status === "failed";
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
          isFailed
            ? "border-slate-200 bg-slate-50 text-slate-600"
            : "border-indigo-200 bg-indigo-50 text-indigo-600"
        }`}
      >
        <HiOutlineClock className="h-3.5 w-3.5" aria-hidden />
        {isFailed ? "Failed" : "Processing"}
      </span>
    );
  }

  const style = OVERALL_STYLES[status] ?? OVERALL_STYLES.green;
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
