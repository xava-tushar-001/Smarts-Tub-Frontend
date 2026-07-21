import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { GetProfile } from "../../api/api_client";

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
  const [user, setUser] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetProfile();
      setUser(res.data?.body?.user ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load your profile."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Profile</h1>
        <p className="mt-1 text-slate-500">Manage your account details</p>
      </div>

      <div className="max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-4 py-5 sm:flex-row sm:items-center sm:px-6 sm:py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl font-semibold text-indigo-600">
              {initialsOf(user?.name, user?.email)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-slate-800">
                {user?.name || "Add your name"}
              </div>
              <div className="truncate text-sm text-slate-500">{user?.email}</div>
            </div>
          </div>
          <Link
            to="/profile/edit"
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:ml-auto sm:justify-start"
          >
            <HiOutlinePencilSquare className="h-4 w-4" aria-hidden />
            Edit Profile
          </Link>
        </div>

        <dl className="divide-y divide-slate-100">
          <div className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-slate-500">Full Name</dt>
            <dd className="text-sm text-slate-800 sm:col-span-2">{user?.name || "—"}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="break-all text-sm text-slate-800 sm:col-span-2">{user?.email || "—"}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-slate-500">About</dt>
            <dd className="text-sm text-slate-800 sm:col-span-2">{user?.about || "—"}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-slate-500">Member Since</dt>
            <dd className="text-sm text-slate-800 sm:col-span-2">
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
      </div>
    </div>
  );
}
