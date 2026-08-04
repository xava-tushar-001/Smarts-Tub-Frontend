import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { CreateSupportTicket } from "../../api/api_client";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

export default function CreateSupportTicketPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "" });

  async function handleSave(e) {
    e.preventDefault();

    const subject = form.subject.trim();
    const description = form.description.trim();
    if (!subject || !description) {
      toast.error("Please provide both a subject and a description.");
      return;
    }

    setSaving(true);
    try {
      await CreateSupportTicket({ subject, description });
      toast.success("Support ticket created.");
      navigate("/support", { replace: true });
    } catch (err) {
      toast.error(readError(err, "Could not create your support ticket."));
    } finally {
      setSaving(false);
    }
  }

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
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">New Support Ticket</h1>
        <p className="mt-1 text-slate-500">Tell us what's going on and we'll get back to you.</p>
      </div>

      <div className="max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSave} className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Brief summary of your issue"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8aa25a] focus:ring-2 focus:ring-[#e4ecc9]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              rows={6}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe your issue in detail"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8aa25a] focus:ring-2 focus:ring-[#e4ecc9]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#17352a] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Submitting…" : "Submit Ticket"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/support")}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
