import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiOutlineArrowPath,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
  HiOutlineLink,
  HiOutlineLockClosed,
  HiOutlineMinus,
  HiOutlineBanknotes,
  HiOutlineChartBar,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import {
  GetBillingStatus,
  GetPayrollStatus,
  SyncPayroll,
  GetPayrollHistory,
} from "../../api/api_client";
import { motion, AnimatePresence } from "framer-motion";

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
      <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
        <HiOutlineMinus className="h-3 w-3" aria-hidden />
        No change
      </span>
    );
  }
  const isUp = direction === "increase";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${isUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      {isUp ? <HiOutlineArrowTrendingUp className="h-3.5 w-3.5" aria-hidden /> : <HiOutlineArrowTrendingDown className="h-3.5 w-3.5" aria-hidden />}
      {formatMoney(Math.abs(amount), currency)}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, subtitle, trend, trendLabel }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className="rounded-lg bg-[#eef2df] p-2.5">
          <Icon className="h-5 w-5 text-[#17352a]" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {trend}
          {trendLabel && <span className="text-slate-500">{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}

export default function EarningsDashboard() {
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [connection, setConnection] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Calculate summary statistics
  const calculateStats = (records) => {
    if (!records || records.length === 0) return null;
    
    const totalGross = records.reduce((sum, r) => sum + (r.gross_pay || 0), 0);
    const totalNet = records.reduce((sum, r) => sum + (r.net_pay || 0), 0);
    const totalBonus = records.reduce((sum, r) => sum + (r.bonus_amount || 0), 0);
    const totalOvertime = records.reduce((sum, r) => sum + (r.overtime_amount || 0), 0);
    const avgGross = totalGross / records.length;
    const latest = records[0];
    const previous = records[1];
    
    let trend = null;
    if (latest && previous) {
      const change = ((latest.gross_pay - previous.gross_pay) / previous.gross_pay) * 100;
      trend = {
        direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
        percentage: Math.abs(change).toFixed(1)
      };
    }
    
    return {
      totalGross,
      totalNet,
      totalBonus,
      totalOvertime,
      avgGross,
      trend,
      recordCount: records.length,
      currency: records[0]?.currency || "USD"
    };
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [billingRes, payrollRes] = await Promise.all([GetBillingStatus(), GetPayrollStatus()]);
      setIsPaid((billingRes.data?.body?.plan ?? "free") === "paid");
      setConnection(payrollRes.data?.body?.connection ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load your earnings status."));
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

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await SyncPayroll();
      const body = res.data?.body ?? {};
      toast.success(
        body.synced > 0
          ? `✨ Synced ${body.synced} new payroll record${body.synced === 1 ? "" : "s"}.`
          : "✅ Already up to date - no new payroll records found."
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

  const stats = calculateStats(history);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#17352a] border-t-transparent"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading your earnings data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl bg-gradient-to-r from-[#17352a] to-[#2a5a48] bg-clip-text text-transparent"
            >
              Earnings Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-slate-500 text-lg"
            >
              Automated earnings, trends, taxes, and benefits from your payroll provider.
            </motion.p>
          </div>
          
          {isPaid && connection?.status === "active" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              type="button"
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#17352a] to-[#2a5a48] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#17352a]/20 transition-all hover:shadow-xl hover:shadow-[#17352a]/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <HiOutlineArrowPath className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} aria-hidden />
              {syncing ? "Syncing…" : "Sync Now"}
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!isPaid ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto rounded-3xl border border-[#d7dfc0] bg-gradient-to-br from-[#eef2df] to-[#f5f8ea] p-12 text-center shadow-xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#17352a]/10">
                <HiOutlineLockClosed className="h-10 w-10 text-[#17352a]" aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-800">Pro Feature</h3>
              <p className="mt-2 text-slate-600 max-w-md mx-auto">
                A paid subscription is required to view your earnings dashboard. Unlock insights into your income, taxes, and benefits.
              </p>
              <Link
                to="/billing"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#17352a] to-[#2a5a48] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17352a]/20 transition-all hover:shadow-xl hover:shadow-[#17352a]/30 hover:scale-[1.02]"
              >
                Upgrade to Pro
                <HiOutlineArrowPath className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : connection?.status !== "active" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-12 text-center shadow-2xl shadow-slate-200/50"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef2df]">
                <HiOutlineLink className="h-10 w-10 text-[#17352a]" aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-800">Connect Your Payroll Provider</h3>
              <p className="mt-2 text-slate-500 max-w-md mx-auto">
                Link ADP, Gusto, Workday, or another provider to see your earnings here automatically.
              </p>
              <Link
                to="/payroll"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#17352a] to-[#2a5a48] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17352a]/20 transition-all hover:shadow-xl hover:shadow-[#17352a]/30 hover:scale-[1.02]"
              >
                Connect Payroll
                <HiOutlineArrowPath className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              {/* {stats && !historyLoading && history.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <StatCard
                    icon={HiOutlineBanknotes}
                    label="Total Gross Pay"
                    value={formatMoney(stats.totalGross, stats.currency)}
                    subtitle={`${stats.recordCount} pay periods`}
                    trend={
                      stats.trend && (
                        <span className={`inline-flex items-center gap-1 font-medium ${stats.trend.direction === "up" ? "text-emerald-600" : stats.trend.direction === "down" ? "text-rose-600" : "text-slate-400"}`}>
                          {stats.trend.direction === "up" ? <HiOutlineArrowTrendingUp className="h-3.5 w-3.5" /> : stats.trend.direction === "down" ? <HiOutlineArrowTrendingDown className="h-3.5 w-3.5" /> : <HiOutlineMinus className="h-3.5 w-3.5" />}
                          {stats.trend.percentage}%
                        </span>
                      )
                    }
                    trendLabel="vs last period"
                  />
                  <StatCard
                    icon={HiOutlineChartBar}
                    label="Average Gross Pay"
                    value={formatMoney(stats.avgGross, stats.currency)}
                    subtitle="Per pay period"
                  />
                  <StatCard
                    icon={HiOutlineCalendar}
                    label="Total Bonus"
                    value={formatMoney(stats.totalBonus, stats.currency)}
                    subtitle={`${((stats.totalBonus / stats.totalGross) * 100).toFixed(1)}% of gross`}
                  />
                  <StatCard
                    icon={HiOutlineUserGroup}
                    label="Total Overtime"
                    value={formatMoney(stats.totalOvertime, stats.currency)}
                    subtitle={`${((stats.totalOvertime / stats.totalGross) * 100).toFixed(1)}% of gross`}
                  />
                </motion.div>
              )} */}

              {/* Data Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50"
              >
                <div className="border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-slate-50/50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#eef2df] p-2">
                      <HiOutlineDocumentText className="h-5 w-5 text-[#17352a]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-700">Payroll Records</h2>
                      <p className="text-sm text-slate-500">Synced pay statements and how they've changed over time.</p>
                    </div>
                  </div>
                </div>

                {historyLoading ? (
                  <div className="px-6 py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#17352a] border-t-transparent"></div>
                    <p className="mt-4 text-slate-500">Loading payroll data…</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="px-6 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                      <HiOutlineDocumentText className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="mt-4 text-slate-400 font-medium">No payroll data yet</p>
                    <p className="text-sm text-slate-400">Click "Sync Now" to pull your latest pay statements.</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="whitespace-nowrap px-6 py-3.5 font-semibold text-slate-700">
                              <div className="flex items-center gap-1.5">
                                <HiOutlineCalendar className="h-4 w-4" />
                                Pay Date
                              </div>
                            </th>
                            <th className="whitespace-nowrap px-6 py-3.5 font-semibold text-slate-700">Gross Pay</th>
                            <th className="whitespace-nowrap px-6 py-3.5 font-semibold text-slate-700">Net Pay</th>
                            <th className="whitespace-nowrap px-6 py-3.5 font-semibold text-slate-700">Bonus</th>
                            <th className="whitespace-nowrap px-6 py-3.5 font-semibold text-slate-700">Overtime</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((record, index) => (
                            <motion.tr 
                              key={record.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-6 py-3.5 font-medium text-slate-700">{formatDate(record.pay_date)}</td>
                              <td className="px-6 py-3.5">
                                <div className="font-semibold text-slate-800">{formatMoney(record.gross_pay, record.currency)}</div>
                                {record.comparison && (
                                  <ChangeBadge direction={record.comparison.gross_direction} amount={record.comparison.gross_change} currency={record.currency} />
                                )}
                              </td>
                              <td className="px-6 py-3.5">
                                <div className="font-semibold text-slate-800">{formatMoney(record.net_pay, record.currency)}</div>
                                {record.comparison && (
                                  <ChangeBadge direction={record.comparison.net_direction} amount={record.comparison.net_change} currency={record.currency} />
                                )}
                              </td>
                              <td className="px-6 py-3.5">
                                <div className="text-slate-700">{formatMoney(record.bonus_amount, record.currency)}</div>
                                {record.comparison && (
                                  <ChangeBadge direction={record.comparison.bonus_direction} amount={record.comparison.bonus_change} currency={record.currency} />
                                )}
                              </td>
                              <td className="px-6 py-3.5">
                                <div className="text-slate-700">{formatMoney(record.overtime_amount, record.currency)}</div>
                                {record.comparison && (
                                  <ChangeBadge direction={record.comparison.overtime_direction} amount={record.comparison.overtime_change} currency={record.currency} />
                                )}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/30">
                      <p className="text-sm text-slate-500">
                        Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} records
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={historyLoading || meta.page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <HiOutlineChevronLeft className="h-4 w-4" />
                          Previous
                        </button>
                        <button
                          type="button"
                          disabled={historyLoading || meta.page >= meta.totalPages}
                          onClick={() => setPage((p) => p + 1)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Next
                          <HiOutlineChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}