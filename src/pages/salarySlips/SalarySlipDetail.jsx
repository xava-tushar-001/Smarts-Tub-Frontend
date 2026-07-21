import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { GetSalarySlip, GetSalarySlipFile, RetrySalarySlip } from "../../api/api_client";
import { OverallBadge } from "./statusBadge";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const CATEGORIES = [
  {
    key: "pass",
    title: "🟢 Passed",
    empty: "No passed checks.",
    className: "border-green-200 bg-green-50",
    headingClassName: "text-green-700",
    icon: HiOutlineCheckCircle,
    iconClassName: "text-green-500",
  },
  {
    key: "warning",
    title: "🟠 Warnings",
    empty: "No warnings.",
    className: "border-orange-200 bg-orange-50",
    headingClassName: "text-orange-700",
    icon: HiOutlineExclamationTriangle,
    iconClassName: "text-orange-500",
  },
  {
    key: "error",
    title: "🔴 Errors",
    empty: "No errors.",
    className: "border-red-200 bg-red-50",
    headingClassName: "text-red-700",
    icon: HiOutlineXCircle,
    iconClassName: "text-red-500",
  },
];

export default function SalarySlipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [slip, setSlip] = useState(null);
  const [viewingFile, setViewingFile] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetSalarySlip(id);
      setSlip(res.data?.body?.salary_slip ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load this salary slip."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRetry() {
    setRetrying(true);
    try {
      const res = await RetrySalarySlip(id);
      const updated = res.data?.body?.salary_slip;
      setSlip(updated ?? null);
      if (updated?.status === "failed") {
        toast.error(updated.error_message || "Analysis failed again.");
      } else {
        toast.success("Analysis complete.");
      }
    } catch (err) {
      toast.error(readError(err, "Could not retry the analysis."));
    } finally {
      setRetrying(false);
    }
  }

  async function handleViewFile() {
    setViewingFile(true);
    try {
      const res = await GetSalarySlipFile(id);
      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(readError(err, "Could not open the original file."));
    } finally {
      setViewingFile(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-slate-500">Loading salary slip…</p>
      </div>
    );
  }

  if (!slip) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-slate-500">Salary slip not found.</p>
      </div>
    );
  }

  const checksByStatus = {
    pass: (slip.checks ?? []).filter((c) => c.status === "pass"),
    warning: (slip.checks ?? []).filter((c) => c.status === "warning"),
    error: (slip.checks ?? []).filter((c) => c.status === "error"),
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/salary-slips")}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to Salary Slips
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-bold tracking-tight text-slate-800">{slip.file_name}</h1>
            <p className="mt-1 text-slate-500">Uploaded {formatDate(slip.createdAt)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <OverallBadge status={slip.status === "completed" ? slip.overall_status : slip.status} size="lg" />
            <button
              type="button"
              onClick={handleViewFile}
              disabled={viewingFile}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlineEye className="h-4 w-4" aria-hidden />
              View Original File
            </button>
          </div>
        </div>
      </div>

      {slip.status === "processing" && (
        <div className="max-w-2xl rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-6 text-indigo-700">
          Analysis is still in progress. Check back shortly.
        </div>
      )}

      {slip.status === "failed" && (
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 text-slate-600">
          <p className="font-semibold text-slate-700">Analysis failed</p>
          <p className="mt-1 text-sm">{slip.error_message || "Something went wrong while analyzing this file."}</p>
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="mt-4 flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-600 hover:shadow-indigo-500/35 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiOutlineArrowPath className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} aria-hidden />
            {retrying ? "Retrying…" : "Retry Analysis"}
          </button>
        </div>
      )}

      {slip.status === "completed" && (
        <>
          {/* Summary */}
          <div className="mb-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Summary</h2>
            <p className="mt-2 text-slate-600">{slip.summary}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <HiOutlineCheckCircle className="h-3.5 w-3.5" aria-hidden />
                {slip.pass_count} Passed
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                <HiOutlineExclamationTriangle className="h-3.5 w-3.5" aria-hidden />
                {slip.warning_count} Warnings
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                <HiOutlineXCircle className="h-3.5 w-3.5" aria-hidden />
                {slip.error_count} Errors
              </span>
            </div>
          </div>

          {/* Checks by category */}
          <div className="grid max-w-5xl gap-6 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const items = checksByStatus[cat.key];
              const Icon = cat.icon;
              return (
                <div key={cat.key} className={`rounded-2xl border p-5 ${cat.className}`}>
                  <h3 className={`mb-3 text-sm font-semibold ${cat.headingClassName}`}>{cat.title}</h3>
                  {items.length === 0 ? (
                    <p className="text-sm text-slate-500">{cat.empty}</p>
                  ) : (
                    <ul className="space-y-3">
                      {items.map((check, idx) => (
                        <li key={idx} className="flex gap-2 rounded-lg bg-white/70 p-3">
                          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cat.iconClassName}`} aria-hidden />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800">{check.name}</p>
                            <p className="mt-0.5 text-sm text-slate-600">{check.message}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
