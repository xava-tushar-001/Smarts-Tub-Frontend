import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineCheckCircle, HiOutlineSparkles } from "react-icons/hi2";
import { SelectPlan, CreateCheckoutSession } from "../../api/api_client";
import {
  SUBSCRIPTION_PLANS,
  PAID_UPLOAD_LIMIT,
  getPlanById,
  getMonthlyEquivalent,
  getSavingsPercent,
} from "../../config/plans";
import MianLogo from "../../assets/logo.webp";

const DEFAULT_TIER = SUBSCRIPTION_PLANS.find((plan) => plan.recommended)?.id ?? SUBSCRIPTION_PLANS[0].id;

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

function FreeBullet({ children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
        <HiOutlineCheckCircle className="h-3.5 w-3.5 text-slate-500" aria-hidden />
      </span>
      <span>{children}</span>
    </li>
  );
}

function PaidBullet({ children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#17352a]/10">
        <HiOutlineCheckCircle className="h-3.5 w-3.5 text-[#17352a]" aria-hidden />
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function PlanSelection() {
  const navigate = useNavigate();
  const [choosing, setChoosing] = useState(null); // 'free' | 'paid' | null
  const [selectedTier, setSelectedTier] = useState(DEFAULT_TIER);
  const selectedPlan = getPlanById(selectedTier);
  const selectedSavings = getSavingsPercent(selectedPlan);

  async function handleChooseFree() {
    setChoosing("free");
    try {
      await SelectPlan({ plan: "free" });
      toast.success("You're all set on the Free plan.");
      navigate("/home", { replace: true });
    } catch (err) {
      toast.error(readError(err, "Could not save your plan choice."));
      setChoosing(null);
    }
  }

  async function handleChoosePaid() {
    setChoosing("paid");
    try {
      await SelectPlan({ plan: selectedTier });
      const res = await CreateCheckoutSession({ plan: selectedTier });
      const url = res.data?.body?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not start checkout.");
        navigate("/home", { replace: true });
      }
    } catch (err) {
      toast.error(readError(err, "Could not start checkout."));
      navigate("/home", { replace: true });
    } finally {
      setChoosing(null);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#faf9f4] px-4 py-12 sm:px-6">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <img src={MianLogo} alt="Logo" className="mx-auto h-14 w-auto" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            Choose how you'll use SmartStub
          </h1>
          <p className="mt-2 text-slate-500">
            You can switch plans at any time from Billing later.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Free</h2>
              <p className="mt-1 text-3xl font-bold text-slate-800">$0</p>
              <p className="mt-1 text-xs text-slate-400">No card required</p>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
              <FreeBullet>Up to 3 payslip uploads / month</FreeBullet>
              <FreeBullet>Basic AI salary breakdown</FreeBullet>
              <FreeBullet>Limited upload history</FreeBullet>
            </ul>
            <button
              type="button"
              onClick={handleChooseFree}
              disabled={choosing !== null}
              className="mt-8 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {choosing === "free" ? "Setting up…" : "Continue with Free"}
            </button>
          </div>

          {/* Paid plan, duration picked via a segmented selector */}
          <div className="flex flex-col rounded-2xl border-2 border-[#17352a] bg-gradient-to-b from-white to-[#f7faee] p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-1.5">
              <HiOutlineSparkles className="h-4 w-4 text-[#17352a]" aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#17352a]">Paid Plan</h2>
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
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
                    disabled={choosing !== null}
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

            <div className="mt-5 rounded-xl bg-[#eef2df] px-4 py-3">
              <p className="text-2xl font-bold text-slate-800">
                {selectedPlan.priceLabel}
                <span className="text-base font-medium text-slate-500">{selectedPlan.period}</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                ≈ ${getMonthlyEquivalent(selectedPlan).toFixed(2)}/month · {selectedPlan.billingNote}
                {selectedSavings > 0 && ` · Save ${selectedSavings}% vs. paying monthly`}
              </p>
            </div>

            <ul className="mt-5 flex-1 space-y-3 text-sm text-slate-600">
              <PaidBullet>Up to {PAID_UPLOAD_LIMIT} payslip uploads per billing period</PaidBullet>
              <PaidBullet>Advanced analytics &amp; salary trends</PaidBullet>
              <PaidBullet>Automatic payroll sync via Finch</PaidBullet>
              <PaidBullet>Full history &amp; downloadable reports</PaidBullet>
            </ul>

            <button
              type="button"
              onClick={handleChoosePaid}
              disabled={choosing !== null}
              className="mt-8 w-full rounded-lg bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {choosing === "paid"
                ? "Redirecting…"
                : `Choose ${selectedPlan.name} — ${selectedPlan.priceLabel}${selectedPlan.period}`}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">Cancel anytime from Billing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
