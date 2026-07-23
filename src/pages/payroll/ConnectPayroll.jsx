import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFinchConnect } from "@tryfinch/react-connect";
import {
  HiOutlineArrowPath,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
  HiOutlineBuildingOffice2,
  HiOutlineLink,
  HiOutlineLinkSlash,
  HiOutlineLockClosed,
  HiOutlineMinus,
} from "react-icons/hi2";
import {
  GetBillingStatus,
  GetPayrollStatus,
  CreatePayrollSession,
  ConnectPayroll as connectPayrollRequest,
  DisconnectPayroll,
  SyncPayroll,
  GetPayrollHistory,
} from "../../api/api_client";

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
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(cents, currency) {
  if (cents === null || cents === undefined) return "—";
  return `${(cents / 100).toFixed(2)} ${(currency || "usd").toUpperCase()}`;
}

function ChangeBadge({ direction, amount, currency }) {
  if (!direction || direction === "unchanged" || !amount) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <HiOutlineMinus className="h-3 w-3" aria-hidden />
        No change
      </span>
    );
  }
  const isUp = direction === "increase";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isUp ? "text-[#3f7d3a]" : "text-[#b6472f]"}`}>
      {isUp ? <HiOutlineArrowTrendingUp className="h-3.5 w-3.5" aria-hidden /> : <HiOutlineArrowTrendingDown className="h-3.5 w-3.5" aria-hidden />}
      {formatMoney(Math.abs(amount), currency)}
    </span>
  );
}

export default function ConnectPayroll() {
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [connection, setConnection] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [billingRes, payrollRes] = await Promise.all([GetBillingStatus(), GetPayrollStatus()]);
      setIsPaid((billingRes.data?.body?.plan ?? "free") === "paid");
      setConnection(payrollRes.data?.body?.connection ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load payroll status."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await GetPayrollHistory({ page });
      const body = res.data?.body;
      setHistory(Array.isArray(body?.records) ? body.records : []);
      const p = body?.pagination ?? {};
      setMeta({
        page: p.page ?? page,
        limit: p.limit ?? 10,
        total: p.total ?? 0,
        totalPages: p.totalPages ?? 1,
      });
    } catch (err) {
      toast.error(readError(err, "Could not load payroll history."));
    } finally {
      setHistoryLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (connection?.status === "active") {
      loadHistory();
    }
  }, [connection?.status, loadHistory]);

  const { open } = useFinchConnect({
    onSuccess: async ({ code }) => {
      try {
        const res = await connectPayrollRequest(code);
        setConnection(res.data?.body?.connection ?? null);
        toast.success("Payroll account connected.");
      } catch (err) {
        toast.error(readError(err, "Could not finish connecting your payroll account."));
      } finally {
        setConnecting(false);
      }
    },
    onError: (e) => {
      toast.error(e.errorMessage || "Payroll connection failed.");
      setConnecting(false);
    },
    onClose: () => {
      setConnecting(false);
    },
  });

  async function handleConnectClick() {
    // Give immediate feedback - session creation + the Finch popup can take a moment.
    setConnecting(true);
    try {
      const res = await CreatePayrollSession();
      const sessionId = res.data?.body?.session_id;
      if (!sessionId) {
        toast.error("Could not start the payroll connection.");
        setConnecting(false);
        return;
      }
      open({ sessionId });
      // setConnecting(false) happens in onSuccess/onError/onClose once the popup resolves.
    } catch (err) {
      toast.error(readError(err, "Could not start the payroll connection."));
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      const res = await DisconnectPayroll();
      setConnection(res.data?.body?.connection ?? null);
      toast.success("Payroll account disconnected.");
    } catch (err) {
      toast.error(readError(err, "Could not disconnect your payroll account."));
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await SyncPayroll();
      const body = res.data?.body ?? {};
      toast.success(
        body.synced > 0
          ? `Synced ${body.synced} new payroll record${body.synced === 1 ? "" : "s"}.`
          : "Already up to date - no new payroll records found."
      );
      setPage(1);
      await loadHistory();
    } catch (err) {
      const reauthRequired = err.response?.data?.body?.reauth_required;
      if (reauthRequired) {
        toast.error(readError(err, "Your payroll connection has expired. Please reconnect."));
        setConnection((c) => (c ? { ...c, status: "disconnected" } : c));
      } else {
        toast.error(readError(err, "Could not sync payroll data."));
      }
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Connect Payroll</h1>
        <p className="mt-1 text-slate-500">Securely link your payroll provider for automatic syncing.</p>
      </div>

      {!isPaid ? (
        <div className="max-w-lg rounded-2xl border border-[#d7dfc0] bg-[#eef2df] p-8 text-center">
          <HiOutlineLockClosed className="mx-auto h-8 w-8 text-[#17352a]" aria-hidden />
          <p className="mt-3 font-semibold text-slate-800">Pro feature</p>
          <p className="mt-1 text-sm text-slate-600">
            A paid subscription is required to connect your payroll account.
          </p>
          <Link
            to="/billing"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#17352a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2820]"
          >
            Upgrade to Pro
          </Link>
        </div>
      ) : connection?.status === "active" ? (
        <>
          <div className="mb-6 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9f2e0] text-[#3f7d3a]">
                  <HiOutlineBuildingOffice2 className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800">
                    {connection.provider ? `Connected to ${connection.provider}` : "Payroll connected"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Since {formatDate(connection.connected_at)}
                    {connection.last_sync_at ? ` · Last synced ${formatDate(connection.last_sync_at)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#17352a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2820] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <HiOutlineArrowPath className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} aria-hidden />
                  {syncing ? "Syncing…" : "Sync Now"}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <HiOutlineLinkSlash className="h-4 w-4" aria-hidden />
                  {disconnecting ? "Disconnecting…" : "Disconnect"}
                </button>
              </div>
            </div>
          </div>

          {/* Payroll data section */}
          <div className="max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-700">Payroll Data</h2>
              <p className="mt-0.5 text-sm text-slate-500">Synced pay statements and how they've changed over time.</p>
            </div>

            {historyLoading ? (
              <p className="px-6 py-12 text-center text-slate-400">Loading payroll data…</p>
            ) : history.length === 0 ? (
              <p className="px-6 py-16 text-center text-slate-400">
                No payroll data yet. Click "Sync Now" to pull your latest pay statements.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Pay Date</th>
                      <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Gross Pay</th>
                      <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Net Pay</th>
                      <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Bonus</th>
                      <th className="whitespace-nowrap px-6 py-3 font-semibold text-slate-700">Overtime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                        <td className="px-6 py-3 text-slate-600">{formatDate(record.pay_date)}</td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-slate-800">{formatMoney(record.gross_pay, record.currency)}</div>
                          {record.comparison && (
                            <ChangeBadge direction={record.comparison.gross_direction} amount={record.comparison.gross_change} currency={record.currency} />
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-slate-800">{formatMoney(record.net_pay, record.currency)}</div>
                          {record.comparison && (
                            <ChangeBadge direction={record.comparison.net_direction} amount={record.comparison.net_change} currency={record.currency} />
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-slate-700">{formatMoney(record.bonus_amount, record.currency)}</div>
                          {record.comparison && (
                            <ChangeBadge direction={record.comparison.bonus_direction} amount={record.comparison.bonus_change} currency={record.currency} />
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-slate-700">{formatMoney(record.overtime_amount, record.currency)}</div>
                          {record.comparison && (
                            <ChangeBadge direction={record.comparison.overtime_direction} amount={record.comparison.overtime_change} currency={record.currency} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!historyLoading && history.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-3">
                <p className="text-sm text-slate-500">
                  Page {meta.page} of {meta.totalPages} · {meta.total} Record{meta.total !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={historyLoading || meta.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={historyLoading || meta.page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2df]">
            <HiOutlineLink className="h-7 w-7 text-[#17352a]" aria-hidden />
          </div>
          <p className="mt-4 font-semibold text-slate-800">
            {connection?.status === "disconnected" ? "Reconnect your payroll provider" : "Link your payroll provider"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {connection?.status === "disconnected"
              ? "Your connection has expired or was disconnected. Reconnect to keep syncing your pay data."
              : "Connect ADP, Gusto, Workday, and hundreds of other providers to sync your pay data automatically."}
          </p>
          <button
            type="button"
            onClick={handleConnectClick}
            disabled={connecting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2820] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {connecting && <HiOutlineArrowPath className="h-4 w-4 animate-spin" aria-hidden />}
            {connecting ? "Opening secure connection…" : connection?.status === "disconnected" ? "Reconnect Payroll Provider" : "Connect Payroll Provider"}
          </button>
        </div>
      )}
    </div>
  );
}
