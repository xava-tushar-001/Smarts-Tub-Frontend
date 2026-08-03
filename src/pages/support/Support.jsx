import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlinePlus, HiOutlineLifebuoy, HiOutlineChevronRight } from "react-icons/hi2";
import { GetSupportTickets } from "../../api/api_client";
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center text-slate-400">
      <HiOutlineLifebuoy className="h-8 w-8 text-slate-300" aria-hidden />
      <p>You haven't submitted any support tickets yet.</p>
      <Link to="/support/new" className="font-medium text-[#17352a] hover:text-[#0f2820]">
        Create your first ticket
      </Link>
    </div>
  );
}

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetSupportTickets();
      const rows = res.data?.body?.tickets ?? [];
      setTickets(Array.isArray(rows) ? rows : []);
    } catch (err) {
      toast.error(readError(err, "Could not load your support tickets."));
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Support</h1>
          <p className="mt-1 text-slate-500">Create a ticket and track its status.</p>
        </div>
        <Link
          to="/support/new"
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30 sm:justify-start"
        >
          <HiOutlinePlus className="h-4 w-4" aria-hidden />
          New Ticket
        </Link>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden">
        {loading ? (
          <p className="px-1 py-12 text-center text-slate-400">Loading tickets…</p>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((row) => (
              <Link
                key={row.id}
                to={`/support/${row.id}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#d7dfc0] hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">{row.subject}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{formatDate(row.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <TicketStatusBadge status={row.status} />
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
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">Subject</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">Created</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                    Loading tickets…
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                tickets.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    <td className="max-w-[320px] truncate px-4 py-3 font-medium text-slate-800" title={row.subject}>
                      {row.subject}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <TicketStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/support/${row.id}`}
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
    </div>
  );
}
