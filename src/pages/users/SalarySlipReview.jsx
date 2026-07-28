import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import {
  GetAdminSalarySlip,
  GetUserSalarySlipFile,
  OverrideSalarySlip,
  RetryAdminSalarySlip,
} from "../../api/api_client";
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

const STATUS_OPTIONS = ["pass", "warning", "error"];

export default function SalarySlipReview() {
  const { id, slipId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [slip, setSlip] = useState(null);
  const [viewingFile, setViewingFile] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Draft state used only while editing
  const [draftChecks, setDraftChecks] = useState([]);
  const [draftSummary, setDraftSummary] = useState("");
  const [draftNote, setDraftNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetAdminSalarySlip(slipId);
      setSlip(res.data?.body?.salary_slip ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load this salary slip."));
    } finally {
      setLoading(false);
    }
  }, [slipId]);

  useEffect(() => {
    load();
  }, [load]);

  function startEditing() {
    setDraftChecks(
      (Array.isArray(slip.checks) ? slip.checks : []).map((c) => ({ ...c }))
    );
    setDraftSummary(slip.summary || "");
    setDraftNote(slip.admin_note || "");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  function updateCheck(index, field, value) {
    setDraftChecks((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function removeCheck(index) {
    setDraftChecks((prev) => prev.filter((_, i) => i !== index));
  }

  function addCheck() {
    setDraftChecks((prev) => [...prev, { name: "", status: "pass", message: "" }]);
  }

  async function handleSave() {
    if (draftChecks.length === 0) {
      toast.error("Add at least one check before saving.");
      return;
    }
    if (draftChecks.some((c) => !c.name.trim())) {
      toast.error("Every check needs a name.");
      return;
    }
    setSaving(true);
    try {
      const res = await OverrideSalarySlip(slipId, {
        checks: draftChecks,
        summary: draftSummary,
        admin_note: draftNote,
      });
      setSlip(res.data?.body?.salary_slip ?? null);
      setEditing(false);
      toast.success("Correction saved.");
    } catch (err) {
      toast.error(readError(err, "Could not save the correction."));
    } finally {
      setSaving(false);
    }
  }

  async function handleRetry() {
    setRetrying(true);
    try {
      const res = await RetryAdminSalarySlip(slipId);
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
      const res = await GetUserSalarySlipFile(id, slipId);
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

  const checksToShow = editing ? draftChecks : Array.isArray(slip.checks) ? slip.checks : [];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(`/users/${id}/salary-slips`)}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to Payslip History
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">{slip.file_name}</h1>
            <p className="mt-1 text-slate-500">
              Uploaded {formatDate(slip.createdAt)}
              {slip.admin_overridden && (
                <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  Admin-corrected
                </span>
              )}
            </p>
            {slip.admin_reviewed_at && (
              <p className="mt-0.5 text-xs text-slate-400">Last reviewed {formatDate(slip.admin_reviewed_at)}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <OverallBadge status={slip.status === "completed" ? slip.overall_status : slip.status} size="lg" />
            <button
              type="button"
              onClick={handleViewFile}
              disabled={viewingFile}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlineEye className="h-4 w-4" aria-hidden />
              View Original
            </button>
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying || editing}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlineArrowPath className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} aria-hidden />
              {retrying ? "Retrying…" : "Retry Analysis"}
            </button>
            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <HiOutlinePencilSquare className="h-4 w-4" aria-hidden />
                Correct
              </button>
            )}
          </div>
        </div>
      </div>

      {slip.status === "processing" && (
        <div className="mb-6 max-w-3xl rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-6 text-indigo-800">
          Analysis is still in progress. Check back shortly.
        </div>
      )}

      {slip.status === "failed" && !editing && (
        <div className="mb-6 max-w-3xl rounded-2xl border border-rose-200 bg-rose-50 px-6 py-6 text-rose-700">
          <p className="font-semibold">Analysis failed</p>
          <p className="mt-1 text-sm">{slip.error_message || "Something went wrong while analyzing this file."}</p>
          <p className="mt-2 text-sm">Use "Retry Analysis" above to try again, or "Correct" to enter the breakdown by hand.</p>
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Summary</h2>
        {editing ? (
          <textarea
            value={draftSummary}
            onChange={(e) => setDraftSummary(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="Plain-language summary shown to the user"
          />
        ) : (
          <p className="mt-2 text-slate-600">{slip.summary || "—"}</p>
        )}
      </div>

      {/* Checks */}
      <div className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Checks</h2>
          {editing && (
            <button
              type="button"
              onClick={addCheck}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <HiOutlinePlus className="h-3.5 w-3.5" aria-hidden />
              Add check
            </button>
          )}
        </div>

        {checksToShow.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No checks recorded.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {checksToShow.map((check, idx) => (
              <li key={idx} className="rounded-lg border border-slate-200 p-3">
                {editing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={check.name}
                        onChange={(e) => updateCheck(idx, "name", e.target.value)}
                        placeholder="Check name"
                        className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                      <select
                        value={check.status}
                        onChange={(e) => updateCheck(idx, "status", e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeCheck(idx)}
                        aria-label="Remove check"
                        className="flex items-center justify-center rounded-lg border border-slate-200 px-2 text-slate-500 transition hover:bg-slate-50 hover:text-rose-600"
                      >
                        <HiOutlineTrash className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <textarea
                      value={check.message}
                      onChange={(e) => updateCheck(idx, "message", e.target.value)}
                      rows={2}
                      placeholder="Message shown to the user"
                      className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{check.name}</p>
                      <p className="mt-0.5 text-sm text-slate-600">{check.message}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        check.status === "pass"
                          ? "bg-green-50 text-green-700"
                          : check.status === "warning"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {check.status}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {editing && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Internal note (not shown to the user)
            </label>
            <textarea
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              rows={2}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Why this was corrected, for other admins"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HiOutlineXMark className="h-4 w-4" aria-hidden />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Correction"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
