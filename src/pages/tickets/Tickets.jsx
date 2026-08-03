import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { GetTickets } from "../../api/api_client";
import { TicketStatusBadge } from "./statusBadge";

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

export default function Tickets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetTickets({ page, search: debouncedSearch, status: statusFilter });
      const body = res.data?.body;
      const rows = body?.tickets ?? [];
      const p = body?.pagination ?? {};
      setTickets(Array.isArray(rows) ? rows : []);
      setMeta({
        page: p.page ?? page,
        limit: p.limit ?? 10,
        total: p.total ?? rows.length,
        totalPages: p.totalPages ?? 1,
      });
    } catch (err) {
      toast.error(readError(err, "Could not load support tickets."));
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function handleStatusChange(value) {
    setStatusFilter(value);
    setPage(1);
    setSearchParams(value ? { status: value } : {});
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Support Tickets</h1>
        <p className="mt-1 text-black/60">Tickets submitted by users</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by subject"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02]">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Subject</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">User</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Created</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-black/50">
                    Loading tickets…
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-black/50">
                    No support tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((row) => (
                  <tr key={row.id} className="border-b border-black/[0.06] last:border-0 hover:bg-black/[0.02]">
                    <td className="max-w-[280px] truncate px-4 py-3 font-medium text-black" title={row.subject}>
                      {row.subject}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-black">{row.user?.name || "—"}</div>
                      <div className="text-xs text-black/50">{row.user?.email || "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <TicketStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-black/70">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/tickets/${row.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium text-black transition hover:bg-black/[0.04]"
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-4 py-3">
          <p className="text-sm text-black/60">
            Page {meta.page} of {meta.totalPages} · {meta.total} Ticket{meta.total !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={loading || meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
