import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft, HiOutlineEye, HiOutlinePencilSquare } from "react-icons/hi2";
import { GetUserDetail, GetUserSalarySlips, GetUserSalarySlipFile } from "../../api/api_client";
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

export default function UserSalarySlips() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const [slips, setSlips] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [openingFile, setOpeningFile] = useState(null);

  useEffect(() => {
    GetUserDetail(id)
      .then((res) => setUser(res.data?.body?.user ?? null))
      .catch(() => {});
  }, [id]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetUserSalarySlips(id, { page });
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
      toast.error(readError(err, "Could not load payslip history."));
      setSlips([]);
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleViewFile(slipId) {
    setOpeningFile(slipId);
    try {
      const res = await GetUserSalarySlipFile(id, slipId);
      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(readError(err, "Could not open the file."));
    } finally {
      setOpeningFile(null);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(`/users/${id}`)}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to User
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Payslip Upload History</h1>
        <p className="mt-1 text-slate-500">{user ? `${user.name || user.email}` : " "}</p>
      </div>

      <div className="max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">File</th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Uploaded</th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Result</th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Checks</th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Loading payslips…
                  </td>
                </tr>
              ) : slips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                    No payslips uploaded yet.
                  </td>
                </tr>
              ) : (
                slips.map((slip) => (
                  <tr key={slip.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    <td className="max-w-[220px] truncate px-6 py-3 font-medium text-slate-800" title={slip.file_name}>
                      {slip.file_name}
                    </td>
                    <td className="px-6 py-3 text-slate-500">{formatDate(slip.createdAt)}</td>
                    <td className="px-6 py-3">
                      <OverallBadge status={slip.status === "completed" ? slip.overall_status : slip.status} />
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-500">
                      {slip.status === "completed"
                        ? `${slip.pass_count} passed · ${slip.warning_count} warnings · ${slip.error_count} errors`
                        : "—"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewFile(slip.id)}
                          disabled={openingFile === slip.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <HiOutlineEye className="h-4 w-4" aria-hidden />
                          View
                        </button>
                        <Link
                          to={`/users/${id}/salary-slips/${slip.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                          <HiOutlinePencilSquare className="h-4 w-4" aria-hidden />
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <p className="text-sm text-slate-500">
            Page {meta.page} of {meta.totalPages} · {meta.total} Payslip{meta.total !== 1 ? "s" : ""}
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
      </div>
    </div>
  );
}
