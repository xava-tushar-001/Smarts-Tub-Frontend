import { useCallback, useEffect, useState } from "react";
import { SubscriberGraph } from "../api/api_client";
import {
  LineChart, Line, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis,  Area,  AreaChart, } from "recharts";
import { 
  HiOutlineUsers,  HiOutlineCalendar, HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown, HiOutlineDocumentText, HiOutlineEye } from "react-icons/hi2";

export default function Home() {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    averageGrowth: 0,
    peakDay: "",
    peakCount: 0,
  });

  const getSubscriberGraph = useCallback(async () => {
    try {
      setLoading(true);

      const response = await SubscriberGraph();

      if (response?.data?.body) {
        const formattedData = response.data.body.map((item) => ({
          date: item._id,
          subscribers: item.count,
        }));

        setGraphData(formattedData);

        // Calculate stats
        const total = formattedData.reduce((sum, item) => sum + item.subscribers, 0);
        const avg = total / formattedData.length;
        const peak = formattedData.reduce((max, item) => 
          item.subscribers > max.count ? { date: item.date, count: item.subscribers } : max, 
          { date: "", count: 0 }
        );
        
        setStats({
          totalSubscribers: total,
          averageGrowth: Math.round(avg),
          peakDay: peak.date,
          peakCount: peak.count,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSubscriberGraph();
  }, [getSubscriberGraph]);

  // Calculate growth trend
  const getGrowthTrend = () => {
    if (graphData.length < 2) return "neutral";
    const first = graphData[0]?.subscribers || 0;
    const last = graphData[graphData.length - 1]?.subscribers || 0;
    if (last > first) return "up";
    if (last < first) return "down";
    return "neutral";
  };

  const trend = getGrowthTrend();

  return (
    <div className="min-h-screen from-slate-50 via-white to-indigo-50/30">
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                Dashboard Overview
              </h1>
              <p className="mt-1">
                Welcome back ! Here's what's happening with your platform today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm border border-slate-200">
                <HiOutlineCalendar className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">Last 7 days</span>
              </div>
              {/* <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all hover:bg-indigo-600 hover:shadow-indigo-500/35">
                Export Report
              </button> */}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Subscriber Growth
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Daily new subscribers over the last 7 days
                </p>
              </div>
              {/* <div className="flex gap-2">
                <button className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100">
                  Daily
                </button>
                <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50">
                  Weekly
                </button>
                <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50">
                  Monthly
                </button>
              </div> */}
            </div>

            {loading ? (
              <div className="flex h-[350px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent"></div>
                  <p className="text-sm text-slate-500">Loading chart data...</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={graphData}>
                  <defs>
                    <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={{ stroke: '#E2E8F0' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      padding: '8px 12px',
                    }}
                    formatter={(value) => [`${value.toLocaleString()} subscribers`, 'New']}
                    labelStyle={{ color: '#1E293B', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fill="url(#colorSubscribers)"
                    dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6, fill: '#6366F1', strokeWidth: 3, stroke: '#FFFFFF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Right Sidebar - Quick Stats & Activity */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Recent Activity</h3>
              <div className="mt-4 space-y-3">
                {graphData.slice(-3).reverse().map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.date}</p>
                      <p className="text-xs text-slate-400">Subscribers</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-600">{item.subscribers}</span>
                      <HiOutlineUsers className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}