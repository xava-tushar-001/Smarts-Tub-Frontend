import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft, HiOutlineCreditCard, HiOutlineDocumentMagnifyingGlass, HiOutlineChevronRight } from "react-icons/hi2";
import {
  GetUserDetail,
  GetUserPayments,
  GetUserSalarySlips,
  SuspendUser,
  ReactivateUser,
  DeleteUser,
  OverrideUserPlan,
} from "../../api/api_client";

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
  const [statusActing, setStatusActing] = useState(false);
  const [planActing, setPlanActing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [planDraft, setPlanDraft] = useState("free");
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, paymentsRes, slipsRes] = await Promise.all([
        GetUserDetail(id),
        GetUserPayments(id, { page: 1 }),
        GetUserSalarySlips(id, { page: 1 }),
      ]);
      const loadedUser = userRes.data?.body?.user ?? null;
      setUser(loadedUser);
      setPlanDraft(loadedUser?.plan ?? "free");
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

  function handleSuspendToggle() {
    if (user.status === "suspended") {
      handleReactivate();
      return;
    }
    setSuspendReason("");
    setSuspendModalOpen(true);
  }

  async function handleReactivate() {
    if (!window.confirm(`Reactivate ${user.email}?`)) {
      return;
    }
    setStatusActing(true);
    try {
      await ReactivateUser(id);
      toast.success("User reactivated.");
      await load();
    } catch (err) {
      toast.error(readError(err, "Could not update this account's status."));
    } finally {
      setStatusActing(false);
    }
  }

  async function handleConfirmSuspend() {
    const reason = suspendReason.trim();
    if (!reason) return;
    setStatusActing(true);
    try {
      await SuspendUser(id, reason);
      toast.success("User suspended.");
      setSuspendModalOpen(false);
      await load();
    } catch (err) {
      toast.error(readError(err, "Could not suspend this account."));
    } finally {
      setStatusActing(false);
    }
  }

  async function handleSavePlan() {
    if (planDraft === user.plan) return;
    setPlanActing(true);
    try {
      await OverrideUserPlan(id, planDraft);
      toast.success(`Plan overridden to ${planDraft === "paid" ? "Pro" : "Free"}.`);
      await load();
    } catch (err) {
      toast.error(readError(err, "Could not update this user's plan."));
    } finally {
      setPlanActing(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${user.email}? This removes their access immediately. Their existing payslips and payment records are kept for the books.`)) {
      return;
    }
    setDeleting(true);
    try {
      await DeleteUser(id);
      toast.success("User deleted.");
      navigate("/users");
    } catch (err) {
      toast.error(readError(err, "Could not delete this user."));
      setDeleting(false);
    }
  }

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
          <div className="flex items-center gap-2">
            {user.status === "suspended" && (
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                Suspended
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isPaid ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPaid ? "Paid" : "Free"}
            </span>
          </div>
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

      {/* Account management */}
      <div className="mb-6 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500">Manage Account</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Account status</p>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.status === "suspended" ? "bg-rose-50 text-rose-600" : "bg-green-50 text-green-700"
                }`}
              >
                {user.status === "suspended" ? "Suspended" : "Active"}
              </span>
              <button
                type="button"
                onClick={handleSuspendToggle}
                disabled={statusActing}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  user.status === "suspended"
                    ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                    : "border-rose-200 text-rose-600 hover:bg-rose-50"
                }`}
              >
                {statusActing ? "Working…" : user.status === "suspended" ? "Reactivate" : "Suspend"}
              </button>
            </div>
            {user.status === "suspended" && user.suspend_reason && (
              <p className="mt-2 text-xs text-slate-500">Reason: {user.suspend_reason}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-slate-400">Plan override</p>
            <div className="mt-2 flex items-center gap-3">
              <select
                value={planDraft}
                onChange={(e) => setPlanDraft(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="free">Free</option>
                <option value="paid">Pro</option>
              </select>
              <button
                type="button"
                onClick={handleSavePlan}
                disabled={planActing || planDraft === user.plan}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {planActing ? "Saving…" : "Save"}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Bypasses Stripe - use for goodwill upgrades or support downgrades.</p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Danger zone</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Deletes this account and blocks sign-in. Their payslips and payment records are kept.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="shrink-0 rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete Account"}
            </button>
          </div>
        </div>
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

      {suspendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800">Suspend {user.email}</h3>
            <p className="mt-1 text-sm text-slate-500">
              They'll be signed out immediately and won't be able to log back in. This reason will be emailed to them.
            </p>
            <textarea
              autoFocus
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows={4}
              placeholder="Reason for suspension…"
              className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSuspendModalOpen(false)}
                disabled={statusActing}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                disabled={statusActing || !suspendReason.trim()}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {statusActing ? "Suspending…" : "Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
