import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineCheckCircle, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { GetBillingStatus, CreateCheckoutSession, CreatePortalSession } from "../../api/api_client";

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

export default function Billing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const notifiedRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetBillingStatus();
      setStatus(res.data?.body ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load your billing status."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (notifiedRef.current) return;
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      notifiedRef.current = true;
      toast.success("You're on the Pro plan now.");
      navigate("/billing", { replace: true });
      load();
    } else if (checkout === "cancel") {
      notifiedRef.current = true;
      toast.error("Checkout was cancelled.");
      navigate("/billing", { replace: true });
    }
  }, [searchParams, navigate, load]);

  async function handleUpgrade() {
    setRedirecting(true);
    try {
      const res = await CreateCheckoutSession();
      const url = res.data?.body?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not start checkout.");
        setRedirecting(false);
      }
    } catch (err) {
      toast.error(readError(err, "Could not start checkout."));
      setRedirecting(false);
    }
  }

  async function handleManageBilling() {
    setRedirecting(true);
    try {
      const res = await CreatePortalSession();
      const url = res.data?.body?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not open the billing portal.");
        setRedirecting(false);
      }
    } catch (err) {
      toast.error(readError(err, "Could not open the billing portal."));
      setRedirecting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-slate-500">Loading billing status…</p>
      </div>
    );
  }

  const isPaid = status?.plan === "paid";
  const usageCount = status?.usage?.count ?? 0;
  const usageLimit = status?.usage?.limit ?? 3;
  const usagePct = Math.min(100, Math.round((usageCount / usageLimit) * 100));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Billing</h1>
        <p className="mt-1 text-slate-500">Manage your plan and payslip upload usage</p>
      </div>

      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        {/* Current plan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-500">Current Plan</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isPaid ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPaid ? "Pro" : "Free"}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>
                {usageCount} of {usageLimit} payslips used this month
              </span>
              <span className="font-medium text-slate-800">{usagePct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${usagePct >= 100 ? "bg-red-400" : "bg-indigo-500"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>

          {isPaid ? (
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p>
                Status: <span className="font-medium text-slate-800">{status?.subscription_status || "active"}</span>
              </p>
              {status?.current_period_end && (
                <p>
                  Renews on{" "}
                  <span className="font-medium text-slate-800">{formatDate(status.current_period_end)}</span>
                </p>
              )}
              <button
                type="button"
                onClick={handleManageBilling}
                disabled={redirecting}
                className="mt-2 flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Manage Billing
                <HiOutlineArrowTopRightOnSquare className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={redirecting}
              className="mt-6 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-600 hover:shadow-indigo-500/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {redirecting ? "Redirecting…" : "Upgrade to Pro — $9.99/month"}
            </button>
          )}
        </div>

        {/* Plan comparison */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Plans</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Free</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  Up to 3 payslip uploads / month
                </li>
              </ul>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-800">Pro — $9.99/month</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-indigo-500" aria-hidden />
                  Up to 12 payslip uploads / month
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-indigo-500" aria-hidden />
                  Automatic payroll sync (coming soon)
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-indigo-500" aria-hidden />
                  Full payslip upload history
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
