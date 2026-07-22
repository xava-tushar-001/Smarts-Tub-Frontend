import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowUpTray, HiOutlineDocumentMagnifyingGlass, HiOutlineChevronRight } from "react-icons/hi2";
import { GetSalarySlips } from "../../api/api_client";
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

function ChecksSummary({ row }) {
  if (row.status !== "completed") return <span>—</span>;
  return (
    <span>
      {row.pass_count} passed · {row.warning_count} warnings · {row.error_count} errors
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center text-slate-400">
      <HiOutlineDocumentMagnifyingGlass className="h-8 w-8 text-slate-300" aria-hidden />
      <p>No salary slips uploaded yet.</p>
      <Link to="/salary-slips/upload" className="font-medium text-[#17352a] hover:text-[#0f2820]">
        Upload your first one
      </Link>
    </div>
  );
}

export default function SalarySlips() {
  const [page, setPage] = useState(1);
  const [slips, setSlips] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetSalarySlips({ page });
      const body = res.data?.body;
      const rows = body?.salary_slips ?? [];
      const p = body?.pagination ?? {};
      setSlips(Array.isArray(rows) ? rows : []);
      setMeta({
        page: p.page ?? page,
        limit: p.limit ?? 10,
        total: p.total ?? rows.length,
        totalPages: p.totalPages ?? 1,
      });
    } catch (err) {
      toast.error(readError(err, "Could not load your salary slips."));
      setSlips([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Salary Slip Analysis</h1>
          <p className="mt-1 text-slate-500">
            Upload a salary slip and let AI check it for errors, warnings, and missing information.
          </p>
        </div>
        <Link
          to="/salary-slips/upload"
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30 sm:justify-start"
        >
          <HiOutlineArrowUpTray className="h-4 w-4" aria-hidden />
          Upload Salary Slip
        </Link>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden">
        {loading ? (
          <p className="px-1 py-12 text-center text-slate-400">Loading salary slips…</p>
        ) : slips.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-3">
            {slips.map((row) => (
              <Link
                key={row.id}
                to={`/salary-slips/${row.id}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#d7dfc0] hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">{row.file_name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{formatDate(row.createdAt)}</p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    <ChecksSummary row={row} />
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <OverallBadge status={row.status === "completed" ? row.overall_status : row.status} />
                  <HiOutlineChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop/tablet: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">File</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">Uploaded</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">Result</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">Checks</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    Loading salary slips…
                  </td>
                </tr>
              ) : slips.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                slips.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    <td className="max-w-[220px] truncate px-4 py-3 font-medium text-slate-800" title={row.file_name}>
                      {row.file_name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <OverallBadge status={row.status === "completed" ? row.overall_status : row.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <ChecksSummary row={row} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/salary-slips/${row.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && slips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 md:mt-0 md:rounded-none md:rounded-b-2xl md:border-0 md:border-t">
          <p className="text-sm text-slate-500">
            Page {meta.page} of {meta.totalPages} · {meta.total} Slip{meta.total !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={loading || meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
