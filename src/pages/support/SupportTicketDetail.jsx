import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from "react-icons/hi2";
import { GetSupportTicket, AddSupportTicketMessage } from "../../api/api_client";
import { TicketStatusBadge } from "./statusBadge";

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
    <div className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isAdmin ? "bg-[#eef2df] text-[#0f2820]" : "bg-slate-100 text-slate-700"}`}>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          {isAdmin ? "Support Team" : "You"}
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm">{message}</p>
        <p className="mt-1.5 text-xs opacity-60">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
}

export default function SupportTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetSupportTicket(id);
      setTicket(res.data?.body?.ticket ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load this support ticket."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSend(e) {
    e.preventDefault();
    const message = reply.trim();
    if (!message) return;

    setSending(true);
    try {
      await AddSupportTicketMessage(id, message);
      setReply("");
      await load();
    } catch (err) {
      toast.error(readError(err, "Could not send your message."));
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-slate-500">Loading ticket…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-slate-500">Support ticket not found.</p>
      </div>
    );
  }

  const messages = Array.isArray(ticket.messages) ? ticket.messages : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => navigate("/support")}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to Support
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">{ticket.subject}</h1>
            <p className="mt-1 text-slate-500">Submitted {formatDate(ticket.createdAt)}</p>
          </div>
          <TicketStatusBadge status={ticket.status} size="lg" />
        </div>
      </div>

      <div className="max-w-3xl space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-slate-700">{ticket.description}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Conversation</h2>

          {messages.length === 0 ? (
            <p className="text-sm text-slate-400">No replies yet. We'll update this ticket once our team responds.</p>
          ) : (
            <div className="space-y-3">
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
              placeholder="Send a message about this ticket"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8aa25a] focus:ring-2 focus:ring-[#e4ecc9]"
            />
            <button
              type="submit"
              disabled={sending || !reply.trim()}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#17352a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlinePaperAirplane className="h-4 w-4" aria-hidden />
              {sending ? "Sending…" : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
