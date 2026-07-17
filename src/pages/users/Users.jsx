import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetUsers } from "../../api/api_client";

export default function Users() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetUsers({ page, search: debouncedSearch });
      const body = res.data?.body;
      const rows = body?.users ?? [];
      const p = body?.pagination ?? {};
      setUsers(Array.isArray(rows) ? rows : []);
      setMeta({
        page: p.page ?? page,
        limit: p.limit ?? 10,
        total: p.total ?? rows.length,
        totalPages: p.totalPages ?? 1,
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "Could not load users.";
      toast.error(typeof msg === "string" ? msg : "Could not load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Users</h1>
        <p className="mt-1 text-black/60">Everyone who created an account</p>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02]">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Email</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-black/50">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-black/50">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-black/[0.06] last:border-0 hover:bg-black/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-black">{row.name ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-black/80">{row.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      {row.is_active === 1 ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-black/70">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-4 py-3">
          <p className="text-sm text-black/60">
            Page {meta.page} of {meta.totalPages} · {meta.total} User{meta.total !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={loading || meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
