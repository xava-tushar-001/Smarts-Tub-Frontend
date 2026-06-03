import { useCallback, useEffect, useState } from "react";
import { GetSubscriber } from '../../api/api_client';

export default function Subscriber() {
    const [page, setPage] = useState(1);
    const [subscriber, setSubscriber] = useState([]);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await GetSubscriber({
                page,
                search: debouncedSearch,
            });
            const body = res.data?.body;
            const rows = body?.subscriber ?? [];
            const p = body?.pagenation ?? body?.pagination ?? {};
            setSubscriber(Array.isArray(rows) ? rows : []);
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
                "Could not load subscriber.";
            toast.error(typeof msg === "string" ? msg : "Could not load subscriber.");
            setsubscriber([]);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        load();
    }, [load]);


    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-black">Subscribers</h1>
                <p className="mt-1 text-sm text-black/60">Manage your subscribers</p>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3">
                <input
                    type="text"
                    placeholder="Search by subscriber, email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-black/10 bg-black/[0.02]">
                                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Subscriber</th>
                                <th className="whitespace-nowrap px-4 py-3 font-semibold text-black">Subscribe At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-black/50">
                                        Loading Subscribers…
                                    </td>
                                </tr>
                            ) : subscriber.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-black/50">
                                        No subscriber found.
                                    </td>
                                </tr>
                            ) : (
                                subscriber.map((row) => (
                                    <tr key={row._id} className="border-b border-black/[0.06] last:border-0 hover:bg-black/[0.02]">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-black">{row.email ?? "—"}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-black">    {row.createdAt
                                                ? new Date(row.createdAt).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })
                                                : "—"}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-4 py-3">
                    <p className="text-sm text-black/60">
                        Page {meta.page} of {meta.totalPages} · {meta.total} subscriber{meta.total !== 1 ? "s" : ""}
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
    )
}
