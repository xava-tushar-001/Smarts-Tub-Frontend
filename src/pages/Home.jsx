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
} from "react-icons/hi2";
import { GetProfile, GetSalarySlipStats } from "../api/api_client";

const STATUS_COLORS = { pass: "#22c55e", warning: "#f59e0b", error: "#ef4444" };

export default function Home() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    GetProfile()
      .then((res) => setName(res.data?.body?.user?.name ?? ""))
      .catch(() => {});
    GetSalarySlipStats()
      .then((res) => setStats(res.data?.body ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totals = stats?.totals ?? { total: 0, pass: 0, warning: 0, error: 0 };
  const monthlyUploads = stats?.monthly_uploads ?? [];
  const pieData = [
    { key: "pass", label: "Passed", value: totals.pass },
    { key: "warning", label: "Warnings", value: totals.warning },
    { key: "error", label: "Errors", value: totals.error },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Welcome{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-1 text-slate-500">Here's an overview of your payslip activity.</p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading your stats…</p>
      ) : totals.total === 0 ? (
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-medium text-slate-700">No payslips uploaded yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Upload your first payslip to see your check breakdown and upload trends here.
          </p>
        </div>
      ) : (
        <>
          {/* Stat tiles */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total Uploads</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{totals.total}</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-1.5 text-sm text-green-700">
                <HiOutlineCheckCircle className="h-4 w-4" aria-hidden />
                Passed
              </div>
              <p className="mt-1 text-2xl font-bold text-green-700">{totals.pass}</p>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-center gap-1.5 text-sm text-orange-700">
                <HiOutlineExclamationTriangle className="h-4 w-4" aria-hidden />
                Warnings
              </div>
              <p className="mt-1 text-2xl font-bold text-orange-700">{totals.warning}</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-1.5 text-sm text-red-700">
                <HiOutlineXCircle className="h-4 w-4" aria-hidden />
                Errors
              </div>
              <p className="mt-1 text-2xl font-bold text-red-700">{totals.error}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700">Uploads over the last 6 months</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyUploads}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                    formatter={(value) => [`${value} upload${value === 1 ? "" : "s"}`, ""]}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700">Check results</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-center gap-4 text-xs text-slate-500">
                {pieData.map((entry) => (
                  <span key={entry.key} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[entry.key] }} />
                    {entry.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
