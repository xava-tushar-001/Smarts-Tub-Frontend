import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  HiOutlineBanknotes,
  HiOutlineChartBarSquare,
  HiOutlineCreditCard,
  HiOutlineTableCells,
} from "react-icons/hi2";
import { GetEarningsGraph } from "../../../api/api_client";

const PERIODS = [
  { key: "monthly", label: "Monthly", caption: "Last 12 months" },
  { key: "quarterly", label: "Quarterly", caption: "Last 8 quarters" },
  { key: "yearly", label: "Yearly", caption: "Last 5 years" },
];

// Categorical slots 1-3 of the validated palette, in fixed order - never cycled,
// and keyed by the tier itself so a tier dropping out never repaints the others.
// `unknown` is the de-emphasis role (paid invoices whose user has since lost
// their tier), deliberately a recessive gray rather than a 4th identity hue.
const TIER_COLORS = {
  monthly: "#2a78d6",
  "6month": "#eb6834",
  "1year": "#1baf7a",
  unknown: "#94a3b8",
};

const SURFACE = "#ffffff";

function makeFormatters(currency) {
  const build = (code) => ({
    full: new Intl.NumberFormat("en-US", { style: "currency", currency: code, maximumFractionDigits: 2 }),
    compact: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      notation: "compact",
      maximumFractionDigits: 1,
    }),
  });

  try {
    return build(currency);
  } catch {
    // An unrecognised ISO code on the payments table must not blank the chart.
    return build("USD");
  }
}

export default function EarningsChart() {
  const [period, setPeriod] = useState("monthly");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await GetEarningsGraph({ period });
      setData(res?.data?.body ?? null);
    } catch (error) {
      console.error(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const currency = data?.currency || "USD";
  const fmt = useMemo(() => makeFormatters(currency), [currency]);

  const points = data?.points ?? [];
  const summary = data?.summary ?? { total: 0, transactions: 0, average: 0, tier_totals: {} };
  const tierTotals = summary.tier_totals ?? {};

  // Only stack tiers that actually earned something in this window, so an
  // unused tier never adds a dead legend entry.
  const series = (data?.tiers ?? []).filter((t) => (tierTotals[t.key] ?? 0) > 0);
  const caption = PERIODS.find((p) => p.key === period)?.caption ?? "";
  const hasData = summary.total > 0;

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Title + controls in one row above the plot */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Earnings from Subscribers</h2>
          <p className="text-sm text-slate-500">{caption} · paid invoices, split by plan tier</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                aria-pressed={period === p.key}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  period === p.key
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-pressed={showTable}
            title={showTable ? "Show chart" : "Show data table"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:text-slate-800"
          >
            {showTable ? (
              <HiOutlineChartBarSquare className="h-4 w-4" aria-hidden />
            ) : (
              <HiOutlineTableCells className="h-4 w-4" aria-hidden />
            )}
            <span className="sr-only">{showTable ? "Show chart" : "Show data table"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Headline figures for the selected window */}
          <div className="mt-5 flex flex-wrap gap-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <HiOutlineBanknotes className="h-4 w-4" aria-hidden />
                Total earnings
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-800">{fmt.full.format(summary.total)}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <HiOutlineCreditCard className="h-4 w-4" aria-hidden />
                Payments
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-800">{summary.transactions}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Average payment</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{fmt.full.format(summary.average)}</p>
            </div>
          </div>

          {!hasData ? (
            <p className="mt-10 mb-8 text-center text-sm text-slate-400">
              No subscription earnings recorded in this period.
            </p>
          ) : showTable ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60">
                    <th className="px-3 py-2 font-semibold text-slate-700">Period</th>
                    {series.map((t) => (
                      <th key={t.key} className="px-3 py-2 text-right font-semibold text-slate-700">
                        {t.label}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right font-semibold text-slate-700">Total</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-700">Payments</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((row) => (
                    <tr key={row.key} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-2 text-slate-600">{row.period}</td>
                      {series.map((t) => (
                        <td key={t.key} className="px-3 py-2 text-right text-slate-600">
                          {fmt.full.format(row[t.key] ?? 0)}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right font-medium text-slate-800">
                        {fmt.full.format(row.total ?? 0)}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-600">{row.transactions ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="period"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tickLine={false}
                    width={70}
                    tickFormatter={(value) => fmt.compact.format(value)}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(100,116,139,0.06)" }}
                    content={<EarningsTooltip series={series} format={fmt.full} />}
                  />
                  {series.map((t, i) => (
                    <Bar
                      key={t.key}
                      dataKey={t.key}
                      name={t.label}
                      stackId="earnings"
                      fill={TIER_COLORS[t.key] ?? TIER_COLORS.unknown}
                      // A 2px surface stroke leaves a clean gap between stacked
                      // segments instead of letting two fills touch.
                      stroke={SURFACE}
                      strokeWidth={2}
                      radius={i === series.length - 1 ? [4, 4, 0, 0] : 0}
                      maxBarSize={48}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>

              {/* Legend - identity is never carried by color alone */}
              <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                {series.map((t) => (
                  <span key={t.key} className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: TIER_COLORS[t.key] ?? TIER_COLORS.unknown }}
                    />
                    {t.label}
                    <span className="font-medium text-slate-700">{fmt.full.format(tierTotals[t.key] ?? 0)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EarningsTooltip({ active, payload, label, series, format }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-800">{label}</p>
      <div className="mt-1.5 space-y-1">
        {series.map((t) => (
          <div key={t.key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ background: TIER_COLORS[t.key] ?? TIER_COLORS.unknown }}
            />
            <span className="text-slate-500">{t.label}</span>
            <span className="ml-auto pl-3 font-medium tabular-nums text-slate-800">
              {format.format(row[t.key] ?? 0)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex items-center gap-2 border-t border-slate-100 pt-1.5">
        <span className="text-slate-500">Total</span>
        <span className="ml-auto pl-3 font-semibold tabular-nums text-slate-800">
          {format.format(row.total ?? 0)}
        </span>
      </div>
      <p className="mt-1 text-slate-400">
        {row.transactions ?? 0} payment{row.transactions === 1 ? "" : "s"}
      </p>
    </div>
  );
}
