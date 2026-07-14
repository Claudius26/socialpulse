import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, RotateCw } from "lucide-react";
import useAdminData from "../useAdminData";

const money = (v, c = "NGN") =>
  `${Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${c}`;

const when = (d) => (d ? new Date(d).toLocaleString() : "—");

function StatCard({ label, value, tint, sub }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 tabular-nums ${tint || "text-slate-900 dark:text-white"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

const STATUS_TINT = {
  active: "text-emerald-600 dark:text-emerald-400",
  pending: "text-amber-600 dark:text-amber-400",
  expired: "text-slate-500 dark:text-slate-400",
};

export default function AdminRentals() {
  const { data, loading, refreshing, error } = useAdminData("rentals", { pollMs: 60000 });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState({});

  const rentals = data || [];

  const filtered = rentals.filter((r) =>
    [r.email, r.number, r.service].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const revenue = rentals.reduce((sum, r) => sum + Number(r.total_charged || 0), 0);
  const reactivations = rentals.reduce((sum, r) => sum + Number(r.reactivation_count || 0), 0);

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Loading rentals…</p>;

  return (
    <div>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Rentals</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Every rented number, with each reactivation itemised
            {refreshing ? " · updating…" : ""}
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email, number, service…"
          className="w-full sm:w-72 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Rentals" value={rentals.length} tint="text-sky-600 dark:text-sky-400" />
        <StatCard
          label="Reactivations"
          value={reactivations}
          tint="text-violet-600 dark:text-violet-400"
          sub="Paid reloads"
        />
        <StatCard
          label="Total charged"
          value={money(revenue)}
          tint="text-emerald-600 dark:text-emerald-400"
          sub="Rent + reactivations"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4 w-10" />
              <th className="p-4">User</th>
              <th className="p-4">Number</th>
              <th className="p-4">Service</th>
              <th className="p-4">Status</th>
              <th className="p-4">Reactivations</th>
              <th className="p-4">Total paid</th>
              <th className="p-4">Ends</th>
              <th className="p-4">Rented</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-slate-400">
                  No rentals found.
                </td>
              </tr>
            )}
            {filtered.map((r) => {
              const expanded = !!open[r.id];
              const hasCharges = (r.charges || []).length > 0;
              return (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => hasCharges && setOpen((o) => ({ ...o, [r.id]: !o[r.id] }))}
                    className={`border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 ${
                      hasCharges ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40" : ""
                    }`}
                  >
                    <td className="p-4 text-slate-400">
                      {hasCharges &&
                        (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </td>
                    <td className="p-4">{r.email}</td>
                    <td className="p-4 font-mono font-medium">{r.number || "—"}</td>
                    <td className="p-4">{r.service}</td>
                    <td className={`p-4 font-medium ${STATUS_TINT[r.status] || ""}`}>{r.status}</td>
                    <td className="p-4">
                      {r.reactivation_count > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400">
                          <RotateCw size={12} /> {r.reactivation_count}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4 tabular-nums font-semibold">
                      {money(r.total_charged, r.currency)}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{when(r.ends_at)}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{when(r.created_at)}</td>
                  </tr>

                  {expanded &&
                    (r.charges || []).map((c) => (
                      <tr
                        key={`c-${c.id}`}
                        className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 text-xs"
                      >
                        <td className="p-3" />
                        <td className="p-3 text-slate-400">
                          ↳ {c.kind === "reactivation" ? "reactivation" : "initial rent"}
                        </td>
                        <td className="p-3" colSpan={4} />
                        <td className="p-3 tabular-nums">{money(c.amount, c.currency)}</td>
                        <td className="p-3" />
                        <td className="p-3">{when(c.created_at)}</td>
                      </tr>
                    ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
