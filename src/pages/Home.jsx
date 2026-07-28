import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetDashboardStats } from "../api/api_client";
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
  HiOutlineUsers,
  HiOutlineUserPlus,
  HiOutlineSparkles,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineLink,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

const PLAN_COLORS = { free: "#94a3b8", paid: "#6366f1" };

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await GetDashboardStats();
      setStats(res?.data?.body ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totals = stats?.totals ?? {
    users: 0,
    free_users: 0,
    paid_users: 0,
    salary_slips: 0,
    payroll_connected: 0,
    payroll_reauth_required: 0,
  };
  const monthlySignups = stats?.monthly_signups ?? [];
  const monthlyUploads = stats?.monthly_uploads ?? [];
  const planData = [
    { key: "free", label: "Free", value: totals.free_users },
    { key: "paid", label: "Pro", value: totals.paid_users },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-slate-500">Platform-wide user, plan, and payroll metrics</p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Stat tiles */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Total Users</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <HiOutlineUsers className="h-5 w-5" aria-hidden />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-800">{totals.users}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Free Users</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <HiOutlineUserPlus className="h-5 w-5" aria-hidden />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-800">{totals.free_users}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Pro Users</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <HiOutlineSparkles className="h-5 w-5" aria-hidden />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-800">{totals.paid_users}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Slips Uploaded</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <HiOutlineDocumentMagnifyingGlass className="h-5 w-5" aria-hidden />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-800">{totals.salary_slips}</p>
              </div>
              <Link
                to="/payroll"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Payroll Connected</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <HiOutlineLink className="h-5 w-5" aria-hidden />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-800">{totals.payroll_connected}</p>
              </Link>
              {totals.payroll_reauth_required > 0 && (
                <Link
                  to="/payroll?status=reauth"
                  className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm transition hover:border-rose-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-rose-600">Needs Reconnect</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                      <HiOutlineExclamationTriangle className="h-5 w-5" aria-hidden />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-rose-700">{totals.payroll_reauth_required}</p>
                </Link>
              )}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <h2 className="text-sm font-semibold text-slate-800">New Signups</h2>
                <p className="text-sm text-slate-500">Last 6 months</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlySignups}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                      formatter={(value) => [`${value} signup${value === 1 ? "" : "s"}`, ""]}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-800">Plan Distribution</h2>
                {planData.length === 0 ? (
                  <p className="mt-8 text-center text-sm text-slate-400">No users yet.</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={planData} dataKey="value" nameKey="label" innerRadius={50} outerRadius={80} paddingAngle={2}>
                          {planData.map((entry) => (
                            <Cell key={entry.key} fill={PLAN_COLORS[entry.key]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 flex justify-center gap-4 text-xs text-slate-500">
                      {planData.map((entry) => (
                        <span key={entry.key} className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ background: PLAN_COLORS[entry.key] }} />
                          {entry.label} ({entry.value})
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">Salary Slips Uploaded</h2>
              <p className="text-sm text-slate-500">Last 6 months</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyUploads}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                    formatter={(value) => [`${value} upload${value === 1 ? "" : "s"}`, ""]}
                  />
                  <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
