import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFinchConnect } from "@tryfinch/react-connect";
import {
  HiOutlineArrowPath,
  HiOutlineBuildingOffice2,
  HiOutlineLink,
  HiOutlineLinkSlash,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { GetBillingStatus, GetPayrollStatus, ConnectPayroll as connectPayrollRequest, DisconnectPayroll } from "../../api/api_client";

const FINCH_CLIENT_ID = import.meta.env.VITE_FINCH_CLIENT_ID;
const FINCH_PRODUCTS = ["company", "directory", "individual", "employment", "payment"];

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

export default function ConnectPayroll() {
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [connection, setConnection] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [billingRes, payrollRes] = await Promise.all([GetBillingStatus(), GetPayrollStatus()]);
      setIsPaid((billingRes.data?.body?.plan ?? "free") === "paid");
      setConnection(payrollRes.data?.body?.connection ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load payroll status."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const { openPreview } = useFinchConnect({
    onSuccess: async ({ code }) => {
      try {
        const res = await connectPayrollRequest(code);
        setConnection(res.data?.body?.connection ?? null);
        toast.success("Payroll account connected.");
      } catch (err) {
        toast.error(readError(err, "Could not finish connecting your payroll account."));
      } finally {
        setConnecting(false);
      }
    },
    onError: (e) => {
      toast.error(e.errorMessage || "Payroll connection failed.");
      setConnecting(false);
    },
    onClose: () => {
      setConnecting(false);
    },
  });

  function handleConnectClick() {
    if (!FINCH_CLIENT_ID) {
      toast.error("Payroll integration is not configured yet.");
      return;
    }
    // Give immediate feedback - the Finch popup itself can take a moment to appear.
    setConnecting(true);
    openPreview({ clientId: FINCH_CLIENT_ID, products: FINCH_PRODUCTS });
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      const res = await DisconnectPayroll();
      setConnection(res.data?.body?.connection ?? null);
      toast.success("Payroll account disconnected.");
    } catch (err) {
      toast.error(readError(err, "Could not disconnect your payroll account."));
    } finally {
      setDisconnecting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Connect Payroll</h1>
        <p className="mt-1 text-slate-500">Securely link your payroll provider for automatic syncing.</p>
      </div>

      {!isPaid ? (
        <div className="max-w-lg rounded-2xl border border-[#d7dfc0] bg-[#eef2df] p-8 text-center">
          <HiOutlineLockClosed className="mx-auto h-8 w-8 text-[#17352a]" aria-hidden />
          <p className="mt-3 font-semibold text-slate-800">Pro feature</p>
          <p className="mt-1 text-sm text-slate-600">
            A paid subscription is required to connect your payroll account.
          </p>
          <Link
            to="/billing"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#17352a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2820]"
          >
            Upgrade to Pro
          </Link>
        </div>
      ) : connection?.status === "active" ? (
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9f2e0] text-[#3f7d3a]">
              <HiOutlineBuildingOffice2 className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800">
                {connection.provider ? `Connected to ${connection.provider}` : "Payroll connected"}
              </p>
              <p className="text-sm text-slate-500">Since {formatDate(connection.connected_at)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiOutlineLinkSlash className="h-4 w-4" aria-hidden />
            {disconnecting ? "Disconnecting…" : "Disconnect"}
          </button>
        </div>
      ) : (
        <div className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2df]">
            <HiOutlineLink className="h-7 w-7 text-[#17352a]" aria-hidden />
          </div>
          <p className="mt-4 font-semibold text-slate-800">Link your payroll provider</p>
          <p className="mt-1 text-sm text-slate-500">
            Connect ADP, Gusto, Workday, and hundreds of other providers to sync your pay data automatically.
          </p>
          <button
            type="button"
            onClick={handleConnectClick}
            disabled={connecting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2820] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {connecting && <HiOutlineArrowPath className="h-4 w-4 animate-spin" aria-hidden />}
            {connecting ? "Opening secure connection…" : "Connect Payroll Provider"}
          </button>
        </div>
      )}
    </div>
  );
}
