import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { GetProfile, UpdateProfile } from "../../api/api_client";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", about: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetProfile();
      const user = res.data?.body?.user;
      setForm({ name: user?.name ?? "", about: user?.about ?? "" });
    } catch (err) {
      toast.error(readError(err, "Could not load your profile."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await UpdateProfile({ name: form.name.trim(), about: form.about.trim() });
      toast.success("Profile updated successfully.");
      navigate("/profile", { replace: true });
    } catch (err) {
      toast.error(readError(err, "Could not update your profile."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-slate-500">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to Profile
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Edit Profile</h1>
        <p className="mt-1 text-slate-500">Update your account details</p>
      </div>

      <div className="max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSave} className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8aa25a] focus:ring-2 focus:ring-[#e4ecc9]"
            />
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-semibold text-slate-700 mb-1.5">
              About
            </label>
            <textarea
              id="about"
              rows={3}
              value={form.about}
              onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
              placeholder="A short bio"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8aa25a] focus:ring-2 focus:ring-[#e4ecc9]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#17352a] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
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
