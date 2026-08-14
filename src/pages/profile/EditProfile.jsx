import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft, HiOutlineUser, HiOutlineDocumentText, HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";
import { GetProfile, UpdateProfile } from "../../api/api_client";
import { motion } from "framer-motion";

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
      toast.success("✨ Profile updated successfully!");
      navigate("/profile", { replace: true });
    } catch (err) {
      toast.error(readError(err, "Could not update your profile."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#17352a] border-t-transparent"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            type="button"
            onClick={() => navigate("/profile")}
            className="group mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition-all hover:text-[#17352a]"
          >
            <HiOutlineArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            Back to Profile
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl bg-gradient-to-r from-[#17352a] to-[#2a5a48] bg-clip-text text-transparent"
          >
            Edit Profile
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-slate-500 text-lg"
          >
            Update your personal information and bio
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50"
        >
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-8">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineUser className="h-4 w-4 text-[#17352a]" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Enter your full name"
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-[#17352a] focus:ring-4 focus:ring-[#17352a]/10 hover:border-slate-300"
              />
            </motion.div>

            {/* About Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="about" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineDocumentText className="h-4 w-4 text-[#17352a]" />
                About
              </label>
              <textarea
                id="about"
                rows={4}
                value={form.about}
                onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
                placeholder="Tell us a bit about yourself..."
                className="w-full resize-none rounded-xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-[#17352a] focus:ring-4 focus:ring-[#17352a]/10 hover:border-slate-300 min-h-[120px]"
              />
              <p className="mt-2 text-xs text-slate-400">
                {form.about.length}/500 characters
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col gap-3 sm:flex-row pt-4 border-t border-slate-100"
            >
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#17352a] to-[#2a5a48] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17352a]/20 transition-all hover:shadow-xl hover:shadow-[#17352a]/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving…
                  </>
                ) : (
                  <>
                    <HiOutlineCheck className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HiOutlineXMark className="h-5 w-5" />
                Cancel
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}