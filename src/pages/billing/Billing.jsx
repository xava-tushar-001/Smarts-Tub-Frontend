import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineCheckCircle, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { GetBillingStatus, CreateCheckoutSession, CreatePortalSession } from "../../api/api_client";
import {
  SUBSCRIPTION_PLANS,
  getPlanById,
  getMonthlyEquivalent,
  getSavingsPercent,
  PAID_UPLOAD_LIMIT,
  FREE_UPLOAD_LIMIT,
} from "../../config/plans";

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
  const [selectedTier, setSelectedTier] = useState(
    SUBSCRIPTION_PLANS.find((plan) => plan.recommended)?.id ?? SUBSCRIPTION_PLANS[0].id
  );
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
      toast.success("You're on a paid plan now.");
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
      const res = await CreateCheckoutSession({ plan: selectedTier });
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
  const currentPlan = getPlanById(status?.plan_tier);
  const usageCount = status?.usage?.count ?? 0;
  const usageLimit = status?.usage?.limit ?? (isPaid ? PAID_UPLOAD_LIMIT : FREE_UPLOAD_LIMIT);
  const usagePct = Math.min(100, Math.round((usageCount / usageLimit) * 100));
  const selectedPlan = getPlanById(selectedTier);
  const selectedSavings = getSavingsPercent(selectedPlan);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Billing</h1>
        <p className="mt-1 text-slate-500">Manage your plan and payslip upload usage</p>
      </div>

      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Current plan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-500">Current Plan</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isPaid ? "bg-[#eef2df] text-[#17352a]" : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPaid ? currentPlan?.name ?? "Pro" : "Free"}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>
                {usageCount} of {usageLimit} payslips used this billing period
              </span>
              <span className="font-medium text-slate-800">{usagePct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${usagePct >= 100 ? "bg-red-400" : "bg-[#17352a]"}`}
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
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Choose your billing duration
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const active = plan.id === selectedTier;
                  const savings = getSavingsPercent(plan);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedTier(plan.id)}
                      aria-pressed={active}
                      disabled={redirecting}
                      className={`relative flex flex-col items-center gap-0.5 rounded-xl border-2 px-2 py-3 text-center transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        active
                          ? "border-[#17352a] bg-[#17352a] text-white shadow-md shadow-[#17352a]/20"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {plan.recommended && (
                        <span
                          className={`absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            active ? "bg-white text-[#17352a]" : "bg-[#17352a] text-white"
                          }`}
                        >
                          Best Value
                        </span>
                      )}
                      <span className="text-xs font-semibold">{plan.name}</span>
                      <span className="text-base font-bold">{plan.priceLabel}</span>
                      {savings > 0 && (
                        <span className={`text-[11px] font-semibold ${active ? "text-emerald-200" : "text-emerald-600"}`}>
                          Save {savings}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-[#eef2df] px-4 py-3">
                <p className="text-xl font-bold text-slate-800">
                  {selectedPlan.priceLabel}
                  <span className="text-sm font-medium text-slate-500">{selectedPlan.period}</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  ≈ ${getMonthlyEquivalent(selectedPlan).toFixed(2)}/month · {selectedPlan.billingNote}
                  {selectedSavings > 0 && ` · Save ${selectedSavings}% vs. paying monthly`}
                </p>
              </div>

              <button
                type="button"
                onClick={handleUpgrade}
                disabled={redirecting}
                className="mt-4 w-full rounded-lg bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {redirecting ? "Redirecting…" : `Upgrade — ${selectedPlan.priceLabel}${selectedPlan.period}`}
              </button>
            </div>
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
                  Up to {FREE_UPLOAD_LIMIT} payslip uploads / month
                </li>
              </ul>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-800">Paid — 1 Month / 6 Months / 1 Year</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-[#17352a]" aria-hidden />
                  Up to {PAID_UPLOAD_LIMIT} payslip uploads per billing period
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-[#17352a]" aria-hidden />
                  Payroll sync via Finch
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-[#17352a]" aria-hidden />
                  Full payslip upload history
                </li>
              </ul>
              <ul className="mt-3 space-y-1.5 border-t border-dashed border-slate-100 pt-3 text-xs text-slate-500">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const savings = getSavingsPercent(plan);
                  return (
                    <li key={plan.id} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        {plan.name}
                        {plan.recommended && (
                          <span className="rounded-full bg-[#eef2df] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#17352a]">
                            Best Value
                          </span>
                        )}
                      </span>
                      <span className="text-right">
                        <span className="font-medium text-slate-700">
                          {plan.priceLabel}
                          {plan.period}
                        </span>
                        {savings > 0 && <span className="ml-1.5 font-semibold text-emerald-600">Save {savings}%</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
