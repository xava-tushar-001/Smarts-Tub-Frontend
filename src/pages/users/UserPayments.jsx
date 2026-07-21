import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { GetUserDetail, GetUserPayments } from "../../api/api_client";

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

function formatAmount(cents, currency) {
  return `${(cents / 100).toFixed(2)} ${(currency || "usd").toUpperCase()}`;
}

export default function UserPayments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserDetail(id)
      .then((res) => setUser(res.data?.body?.user ?? null))
      .catch(() => {});
  }, [id]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetUserPayments(id, { page });
      const body = res.data?.body;
      const rows = body?.payments ?? [];
      const p = body?.pagination ?? {};
      setPayments(Array.isArray(rows) ? rows : []);
      setMeta({
        page: p.page ?? page,
        limit: p.limit ?? 10,
        total: p.total ?? rows.length,
        totalPages: p.totalPages ?? 1,
      });
    } catch (err) {
      toast.error(readError(err, "Could not load payment history."));
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    load();
  }, [load]);

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
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Payment History</h1>
        <p className="mt-1 text-slate-500">{user ? `${user.name || user.email}` : " "}</p>
      </div>

      <div className="max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Date</th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Amount</th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Status</th>
                <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Loading payments…
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                    No payments yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    <td className="px-6 py-3 text-slate-600">{formatDate(p.createdAt)}</td>
                    <td className="px-6 py-3 font-medium text-slate-800">{formatAmount(p.amount, p.currency)}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.status === "paid" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{p.description || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <p className="text-sm text-slate-500">
            Page {meta.page} of {meta.totalPages} · {meta.total} Payment{meta.total !== 1 ? "s" : ""}
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
