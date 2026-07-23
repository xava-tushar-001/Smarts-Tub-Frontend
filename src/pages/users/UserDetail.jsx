import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft, HiOutlineCreditCard, HiOutlineDocumentMagnifyingGlass, HiOutlineChevronRight } from "react-icons/hi2";
import { GetUserDetail, GetUserPayments, GetUserSalarySlips } from "../../api/api_client";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

function formatDate(value, withTime = false) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: true } : {}),
  });
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [slipsTotal, setSlipsTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, paymentsRes, slipsRes] = await Promise.all([
        GetUserDetail(id),
        GetUserPayments(id, { page: 1 }),
        GetUserSalarySlips(id, { page: 1 }),
      ]);
      setUser(userRes.data?.body?.user ?? null);
      setPaymentsTotal(paymentsRes.data?.body?.pagination?.total ?? 0);
      setSlipsTotal(slipsRes.data?.body?.pagination?.total ?? 0);
    } catch (err) {
      toast.error(readError(err, "Could not load this user."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-slate-500">Loading user…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-slate-500">User not found.</p>
      </div>
    );
  }

  const isPaid = user.plan === "paid";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to Users
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">{user.name || "—"}</h1>
            <p className="mt-1 text-slate-500">{user.email}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isPaid ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
            }`}
          >
            {isPaid ? "Paid" : "Free"}
          </span>
        </div>
      </div>

      {/* Subscription details */}
      <div className="mb-6 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500">Subscription</h2>
        <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-400">Plan</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{isPaid ? "Pro" : "Free"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Status</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{user.subscription_status || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Renews / Ends</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{formatDate(user.current_period_end)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Joined</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{formatDate(user.createdAt)}</dd>
          </div>
        </dl>
      </div>

      {/* Links to detail pages */}
      <div className="grid max-w-5xl gap-4 sm:grid-cols-2">
        <Link
          to={`/users/${id}/payments`}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <HiOutlineCreditCard className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-800">Payment History</div>
            <div className="text-sm text-slate-500">{paymentsTotal} payment{paymentsTotal !== 1 ? "s" : ""}</div>
          </div>
          <HiOutlineChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </Link>

        <Link
          to={`/users/${id}/salary-slips`}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <HiOutlineDocumentMagnifyingGlass className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-800">Payslip Upload History</div>
            <div className="text-sm text-slate-500">{slipsTotal} payslip{slipsTotal !== 1 ? "s" : ""}</div>
          </div>
          <HiOutlineChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
