import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from "react-icons/hi2";
import { GetTicketDetail, UpdateTicketStatus, ReplyToTicket } from "../../api/api_client";
import { TicketStatusBadge } from "./statusBadge";
import { StatusDropdown } from "./StatusDropdown";

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
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function MessageBubble({ senderType, message, createdAt }) {
  const isAdmin = senderType === "admin";
  return (
    <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isAdmin ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide ${isAdmin ? "text-white/70" : "text-slate-500"}`}>
          {isAdmin ? "You (Admin)" : "User"}
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm">{message}</p>
        <p className={`mt-1.5 text-xs ${isAdmin ? "text-white/60" : "text-slate-400"}`}>{formatDate(createdAt)}</p>
      </div>
    </div>
  );
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [statusDraft, setStatusDraft] = useState("pending");
  const [savingStatus, setSavingStatus] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetTicketDetail(id);
      const data = res.data?.body?.ticket ?? null;
      setTicket(data);
      setStatusDraft(data?.status ?? "pending");
    } catch (err) {
      toast.error(readError(err, "Could not load this support ticket."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusSave() {
    setSavingStatus(true);
    try {
      const res = await UpdateTicketStatus(id, statusDraft);
      const updated = res.data?.body?.ticket;
      setTicket((prev) => (updated ? { ...prev, ...updated } : prev));
      toast.success("Status updated.");
    } catch (err) {
      toast.error(readError(err, "Could not update the status."));
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const message = reply.trim();
    if (!message) return;

    setSending(true);
    try {
      await ReplyToTicket(id, message);
      setReply("");
      await load();
    } catch (err) {
      toast.error(readError(err, "Could not send your reply."));
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-slate-500">Loading ticket…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-slate-500">Support ticket not found.</p>
      </div>
    );
  }

  const messages = Array.isArray(ticket.messages) ? ticket.messages : [];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/tickets")}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to Support Tickets
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">{ticket.subject}</h1>
            <p className="mt-1 text-slate-500">
              Submitted {formatDate(ticket.createdAt)} by{" "}
              <span className="font-medium text-slate-700">{ticket.user?.name || "—"}</span>{" "}
              <span className="text-slate-400">({ticket.user?.email || "—"})</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatusDropdown value={statusDraft} onChange={setStatusDraft} disabled={savingStatus} />
            <button
              type="button"
              onClick={handleStatusSave}
              disabled={savingStatus || statusDraft === ticket.status}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingStatus ? "Saving…" : "Update Status"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-600">{ticket.description}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Conversation</h2>
            <span className="text-xs text-slate-400">Only admins can reply to a ticket</span>
          </div>

          {messages.length === 0 ? (
            <p className="text-sm text-slate-400">No replies yet.</p>
          ) : (
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {messages.map((m) => (
                <MessageBubble key={m.id} senderType={m.sender_type} message={m.message} createdAt={m.createdAt} />
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="mt-5 flex items-end gap-2 border-t border-slate-100 pt-5">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={2}
              placeholder="Write a reply to the user"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={sending || !reply.trim()}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <HiOutlinePaperAirplane className="h-4 w-4" aria-hidden />
              {sending ? "Sending…" : "Send Reply"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
