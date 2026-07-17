import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { GetProfile, UpdateProfile } from "../../api/api_client";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

function initialsOf(name, email) {
  const source = (name || email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", about: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetProfile();
      const fetched = res.data?.body?.user ?? null;
      setUser(fetched);
      setForm({ name: fetched?.name ?? "", about: fetched?.about ?? "" });
    } catch (err) {
      toast.error(readError(err, "Could not load your profile."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEditing() {
    setForm({ name: user?.name ?? "", about: user?.about ?? "" });
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await UpdateProfile({ name: form.name.trim(), about: form.about.trim() });
      setUser(res.data?.body?.user ?? { ...user, ...form });
      setEditing(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(readError(err, "Could not update your profile."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-slate-500">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Profile</h1>
        <p className="mt-1 text-slate-500">Manage your admin account details</p>
      </div>

      <div className="max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50 px-6 py-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl font-semibold text-indigo-600">
            {initialsOf(user?.name, user?.email)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold text-slate-800">
              {user?.name || "Add your name"}
            </div>
            <div className="truncate text-sm text-slate-500">{user?.email}</div>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <HiOutlinePencilSquare className="h-4 w-4" aria-hidden />
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-5 px-6 py-6">
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
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-600 hover:shadow-indigo-500/35 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="divide-y divide-slate-100">
            <div className="grid grid-cols-3 gap-4 px-6 py-4">
              <dt className="text-sm font-medium text-slate-500">Full Name</dt>
              <dd className="col-span-2 text-sm text-slate-800">{user?.name || "—"}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 px-6 py-4">
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="col-span-2 text-sm text-slate-800">{user?.email || "—"}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 px-6 py-4">
              <dt className="text-sm font-medium text-slate-500">About</dt>
              <dd className="col-span-2 text-sm text-slate-800">{user?.about || "—"}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 px-6 py-4">
              <dt className="text-sm font-medium text-slate-500">Member Since</dt>
              <dd className="col-span-2 text-sm text-slate-800">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
