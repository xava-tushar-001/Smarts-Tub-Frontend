import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { SelectPlan, CreateCheckoutSession } from "../../api/api_client";
import MianLogo from "../../assets/logo.webp";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

export default function PlanSelection() {
  const navigate = useNavigate();
  const [choosing, setChoosing] = useState(null); // 'free' | 'paid' | null

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

  async function handleChoosePro() {
    setChoosing("paid");
    try {
      await SelectPlan({ plan: "paid" });
      const res = await CreateCheckoutSession();
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
              <p className="mt-1 text-2xl font-bold text-slate-800">$0</p>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                Up to 3 payslip uploads / month
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                Basic AI salary breakdown
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                Limited upload history
              </li>
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

          {/* Pro */}
          <div className="flex flex-col rounded-2xl border-2 border-[#17352a] bg-white p-6 shadow-sm sm:p-8">
            <div>
              <span className="rounded-full bg-[#eef2df] px-2.5 py-1 text-xs font-semibold text-[#17352a]">
                Recommended
              </span>
              <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Pro</h2>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                $9.99<span className="text-base font-medium text-slate-400">/month</span>
              </p>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-[#17352a]" aria-hidden />
                Up to 12 payslip uploads / month
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-[#17352a]" aria-hidden />
                Advanced analytics &amp; salary trends
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-[#17352a]" aria-hidden />
                Automatic payroll sync via Finch
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineCheckCircle className="h-4 w-4 shrink-0 text-[#17352a]" aria-hidden />
                Full history &amp; downloadable reports
              </li>
            </ul>
            <button
              type="button"
              onClick={handleChoosePro}
              disabled={choosing !== null}
              className="mt-8 w-full rounded-lg bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {choosing === "paid" ? "Redirecting…" : "Upgrade to Pro"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
