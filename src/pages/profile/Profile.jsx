import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaCrown } from "react-icons/fa";
import { HiOutlineClock, HiOutlineMail, HiOutlineCalendar, HiOutlineUser, HiOutlineDocumentText } from "react-icons/hi";
import { GetProfile } from "../../api/api_client";
import { motion } from "framer-motion";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

function initialsOf(name, email) {
  const source = (name || email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function getPlanBadge(plan) {
  if (plan === "paid") {
    return {
      label: "Pro",
      icon: FaCrown,
      className: "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30"
    };
  }
  return {
    label: "Free",
    icon: null,
    className: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600"
  };
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetProfile();
      setUser(res.data?.body?.user ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load your profile."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#17352a] border-t-transparent"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const PlanBadge = getPlanBadge(user?.plan);
  const PlanIcon = PlanBadge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl bg-gradient-to-r from-[#17352a] to-[#2a5a48] bg-clip-text text-transparent"
          >
            Profile
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-slate-500 text-lg"
          >
            Manage your account details and preferences
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50"
        >
          {/* Profile Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#17352a] to-[#2a5a48] px-6 py-8 sm:px-8 sm:py-10">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>
              <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-2xl font-bold text-white shadow-xl ring-4 ring-white/30"
                >
                  {initialsOf(user?.name, user?.email)}
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 ring-2 ring-white"></div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {user?.name || "Add your name"}
                  </h2>
                  <p className="text-white/80 flex items-center gap-2">
                    <HiOutlineMail className="h-4 w-4" />
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <Link
                to="/profile/edit"
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/30 hover:scale-105 sm:ml-auto shadow-lg"
              >
                <HiOutlinePencilSquare className="h-4 w-4" aria-hidden />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Profile Details */}
          <dl className="divide-y divide-slate-100">
            {[
              { icon: HiOutlineUser, label: "Full Name", value: user?.name || "—" },
              { icon: HiOutlineMail, label: "Email", value: user?.email || "—" },
              { icon: HiOutlineDocumentText, label: "About", value: user?.about || "—" },
              { 
                icon: HiOutlineCalendar, 
                label: "Member Since", 
                value: user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—" 
              },
              { 
                icon: null, 
                label: "Plan", 
                value: (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${PlanBadge.className}`}>
                    {PlanIcon && <PlanIcon className="h-3.5 w-3.5" />}
                    {PlanBadge.label}
                  </span>
                )
              },
              { 
                icon: HiOutlineClock, 
                label: "Valid Until", 
                value: user?.current_period_end 
                  ? new Date(user.current_period_end).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—" 
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="grid grid-cols-1 gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </dt>
                <dd className="text-sm text-slate-800 sm:col-span-2 font-medium">
                  {item.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </motion.div>
    </div>
  );
}