import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowPath, HiOutlineLinkSlash } from "react-icons/hi2";
import { GetPayrollConnections, RetryPayrollSync, AdminDisconnectPayroll } from "../../api/api_client";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

function formatDate(value) {
  if (!value) return "Never";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function StatusPill({ status, reauthRequired }) {
  if (reauthRequired) {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
        Needs Reconnect
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      Disconnected
    </span>
  );
}

export default function PayrollConnections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [connections, setConnections] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetPayrollConnections({ page, search: debouncedSearch, status: statusFilter });
      const body = res.data?.body;
      const rows = body?.connections ?? [];
      const p = body?.pagination ?? {};
      setConnections(Array.isArray(rows) ? rows : []);
      setMeta({
        page: p.page ?? page,
        limit: p.limit ?? 10,
        total: p.total ?? rows.length,
        totalPages: p.totalPages ?? 1,
      });
    } catch (err) {
      toast.error(readError(err, "Could not load payroll connections."));
      setConnections([]);
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

  async function handleRetrySync(connection) {
    setActingId(connection.id);
    try {
      const res = await RetryPayrollSync(connection.id);
      const body = res.data?.body ?? {};
      toast.success(
        body.synced > 0
          ? `Synced ${body.synced} new payroll record${body.synced === 1 ? "" : "s"}.`
          : "Already up to date - no new payroll records found."
      );
      load();
    } catch (err) {
      const reauthRequired = err.response?.data?.body?.reauth_required;
      toast.error(readError(err, reauthRequired ? "This user needs to reconnect their payroll provider." : "Could not retry sync."));
      if (reauthRequired) load();
    } finally {
      setActingId(null);
    }
  }

  async function handleDisconnect(connection) {
    if (!window.confirm(`Disconnect payroll for ${connection.user?.email || "this user"}? They'll need to reconnect it themselves.`)) {
      return;
    }
    setActingId(connection.id);
    try {
      await AdminDisconnectPayroll(connection.id);
      toast.success("Payroll connection disconnected.");
      load();
    } catch (err) {
      toast.error(readError(err, "Could not disconnect this connection."));
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Payroll Connections</h1>
        <p className="mt-1 text-black/60">Finch connection health across all users</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by name or email"
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
          <option value="active">Active</option>
          <option value="disconnected">Disconnected</option>
          <option value="reauth">Needs Reconnect</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02]">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">User</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Provider</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Sync Count</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Last Sync</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-black/50">
                    Loading connections…
                  </td>
                </tr>
              ) : connections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-black/50">
                    No payroll connections found
                  </td>
                </tr>
              ) : (
                connections.map((row) => (
                  <tr key={row.id} className="border-b border-black/[0.06] last:border-0 hover:bg-black/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-black">{row.user?.name || "—"}</div>
                      <div className="text-xs text-black/50">{row.user?.email || "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-black/80">{row.provider || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={row.status} reauthRequired={row.reauth_required} />
                    </td>
                    <td className="px-4 py-3 text-black/70">{row.sync_count}</td>
                    <td className="px-4 py-3 text-black/70">{formatDate(row.last_sync_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {row.status === "active" && (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleRetrySync(row)}
                            disabled={actingId === row.id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <HiOutlineArrowPath className={`h-4 w-4 ${actingId === row.id ? "animate-spin" : ""}`} aria-hidden />
                            Retry Sync
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDisconnect(row)}
                            disabled={actingId === row.id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <HiOutlineLinkSlash className="h-4 w-4" aria-hidden />
                            Disconnect
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-4 py-3">
          <p className="text-sm text-black/60">
            Page {meta.page} of {meta.totalPages} · {meta.total} Connection{meta.total !== 1 ? "s" : ""}
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
