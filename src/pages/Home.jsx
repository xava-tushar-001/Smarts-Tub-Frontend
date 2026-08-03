import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  HiOutlineArrowUpTray,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
  HiOutlineSparkles,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { GetProfile, GetSalarySlipStats, GetBillingStatus } from "../api/api_client";

const STATUS_COLORS = { pass: "#3f7d3a", warning: "#c1602f", error: "#b6472f" };

function greetingForHour(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatMoney(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function SummaryCard({ label, value, icon: Icon, bg, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-slate-500">{label}</p>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: bg, color }}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function buildInsight(totals) {
  if (totals.total === 0) return null;
  const issues = totals.warning + totals.error;
  const checksSeen = totals.pass + totals.warning + totals.error;
  const passRate = checksSeen > 0 ? Math.round((totals.pass / checksSeen) * 100) : 0;

  if (issues === 0) {
    return `Every check has passed across your last ${totals.total} payslip${totals.total === 1 ? "" : "s"}. Nothing needs your attention right now.`;
  }
  return `${issues} check${issues === 1 ? "" : "s"} flagged a warning or error across your last ${totals.total} payslip${totals.total === 1 ? "" : "s"} — about ${passRate}% of checks passed. Worth a look.`;
}

export default function Home() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [billing, setBilling] = useState(null);
  const now = new Date();

  useEffect(() => {
    GetProfile()
      .then((res) => setName(res.data?.body?.user?.name ?? ""))
      .catch(() => {});
    GetBillingStatus()
      .then((res) => setBilling(res.data?.body ?? null))
      .catch(() => {});
    GetSalarySlipStats()
      .then((res) => setStats(res.data?.body ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totals = stats?.totals ?? { total: 0, pass: 0, warning: 0, error: 0, gross_pay: 0, net_pay: 0, tax_deduction: 0 };
  const usage = billing?.usage ?? { count: 0, limit: 3 };
  const remainingUploads = Math.max(0, usage.limit - usage.count);
  const isPaid = billing?.plan === "paid";
  const monthlyUploads = stats?.monthly_uploads ?? [];
  const pieData = [
    { key: "pass", label: "Passed", value: totals.pass },
    { key: "warning", label: "Warnings", value: totals.warning },
    { key: "error", label: "Errors", value: totals.error },
  ].filter((d) => d.value > 0);
  const insight = buildInsight(totals);
  const firstName = name ? name.split(" ")[0] : "";
  const salaryBreakdown = [
    { key: "gross", label: "Gross Pay", value: totals.gross_pay },
    { key: "net", label: "Net Pay", value: totals.net_pay },
    { key: "tax", label: "Tax Deduction", value: totals.tax_deduction },
  ];
  const SALARY_COLORS = { gross: "#3f7d3a", net: "#17352a", tax: "#c1602f" };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#c1602f]">
            {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1
            className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {greetingForHour(now.getHours())}{firstName ? `, ${firstName}.` : "."}
          </h1>
          <p className="mt-1 text-slate-500">Here's how your payslips are looking this month.</p>
        </div>
        <Link
          to="/salary-slips/upload"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2820]"
        >
          <HiOutlineArrowUpTray className="h-4 w-4" aria-hidden />
          Upload payslip
        </Link>
      </div>

      {/* Earnings & subscription summary */}
      {/* <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <SummaryCard label="Total Earnings" value={formatMoney(totals.net_pay)} icon={HiOutlineBanknotes} bg="#e9f2e0" color="#3f7d3a" />
        <SummaryCard label="Current Subscription Plan" value={isPaid ? "Pro" : "Free"} icon={HiOutlineSparkles} bg="#eef2df" color="#17352a" />
        <SummaryCard label="Plan Valid Until" value={isPaid ? formatDate(billing?.current_period_end) : "—"} icon={HiOutlineCalendarDays} bg="#fbe6d8" color="#c1602f" />
        <SummaryCard label="Remaining Uploads" value={`${remainingUploads} / ${usage.limit}`} icon={HiOutlineArrowUpTray} bg="#e0ecf2" color="#2f6e8a" />
      </div> */}

      {loading ? (
        <p className="text-slate-500">Loading your stats…</p>
      ) : totals.total === 0 ? (
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-8">
          <p className="font-medium text-slate-700">No payslips uploaded yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Upload your first payslip to see your check breakdown and upload trends here.
          </p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-500">Total Uploads</p>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eceadd] text-[#5a5230]">
                  <HiOutlineDocumentMagnifyingGlass className="h-5 w-5" aria-hidden />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{totals.total}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-500">Passed</p>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e9f2e0] text-[#3f7d3a]">
                  <HiOutlineCheckCircle className="h-5 w-5" aria-hidden />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{totals.pass}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-500">Warnings</p>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fbe6d8] text-[#c1602f]">
                  <HiOutlineExclamationTriangle className="h-5 w-5" aria-hidden />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{totals.warning}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-500">Errors</p>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7dcd6] text-[#b6472f]">
                  <HiOutlineXCircle className="h-5 w-5" aria-hidden />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{totals.error}</p>
            </div>
          </div>

          {/* Chart + insight */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-700">Upload activity</h2>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
                  Last 6 months
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyUploads}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#8a8a7a", fontSize: 12 }} axisLine={{ stroke: "#EFEDE4" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#8a8a7a", fontSize: 12 }} axisLine={{ stroke: "#EFEDE4" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #EFEDE4" }}
                    formatter={(value) => [`${value} upload${value === 1 ? "" : "s"}`, ""]}
                  />
                  <Bar dataKey="count" fill="#17352a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {insight && (
              <div className="rounded-2xl bg-[#17352a] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <HiOutlineSparkles className="h-5 w-5 text-[#d6e17e]" aria-hidden />
                  </div>
                  <span className="rounded-full bg-[#d6e17e] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#17352a]">
                    New Insight
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold leading-snug">
                  {totals.warning + totals.error === 0 ? "All clear this month." : "A few things need your attention."}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{insight}</p>
              </div>
            )}
          </div>

          {/* Check results */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Check results</h2>
            <div className="mt-2 grid gap-6 sm:grid-cols-2 sm:items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EFEDE4" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3">
                {pieData.map((entry) => (
                  <div key={entry.key} className="flex items-center justify-between rounded-xl bg-[#faf9f4] px-4 py-2.5">
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[entry.key] }} />
                      {entry.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Salary breakdown */}
          {(totals.gross_pay > 0 || totals.net_pay > 0 || totals.tax_deduction > 0) && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700">Salary breakdown</h2>
              <p className="mt-1 text-xs text-slate-400">Totals across all completed payslips</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={salaryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE4" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#8a8a7a", fontSize: 12 }} axisLine={{ stroke: "#EFEDE4" }} />
                  <YAxis tick={{ fill: "#8a8a7a", fontSize: 12 }} axisLine={{ stroke: "#EFEDE4" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #EFEDE4" }}
                    formatter={(value) => [formatMoney(value), ""]}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {salaryBreakdown.map((entry) => (
                      <Cell key={entry.key} fill={SALARY_COLORS[entry.key]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
