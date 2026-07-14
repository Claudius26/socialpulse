import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, Wifi } from "lucide-react";
import useAdminData from "../useAdminData";

const money = (v, c = "NGN") =>
  `${Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${c}`;

const data_label = (mb) => {
  if (!mb) return "Unlimited";
  return mb >= 1024 ? `${(mb / 1024).toFixed(mb % 1024 ? 1 : 0)}GB` : `${mb}MB`;
};

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
  completed: "text-emerald-600 dark:text-emerald-400",
  pending: "text-amber-600 dark:text-amber-400",
  failed: "text-rose-600 dark:text-rose-400",
};

export default function AdminEsims() {
  const { data, loading, refreshing, error } = useAdminData("esims", { pollMs: 60000 });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState({}); // esim id -> expanded?

  const esims = data || [];

  const filtered = esims.filter((e) =>
    [e.email, e.bundle_name, e.iccid, e.country_name, e.location]
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const revenue = esims.reduce((sum, e) => sum + Number(e.total_charged || 0), 0);
  const reloads = esims.reduce((sum, e) => sum + Number(e.topup_count || 0), 0);

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Loading eSIMs…</p>;

  return (
    <div>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">eSIMs</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Every eSIM sold, with each data reload{refreshing ? " · updating…" : ""}
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email, bundle, ICCID…"
          className="w-full sm:w-72 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="eSIMs sold" value={esims.length} tint="text-sky-600 dark:text-sky-400" />
        <StatCard label="Reloads" value={reloads} tint="text-violet-600 dark:text-violet-400" />
        <StatCard
          label="Total charged"
          value={money(revenue)}
          tint="text-emerald-600 dark:text-emerald-400"
          sub="Initial sale + reloads"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4 w-10" />
              <th className="p-4">User</th>
              <th className="p-4">Bundle</th>
              <th className="p-4">Data</th>
              <th className="p-4">ICCID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Initial</th>
              <th className="p-4">Reloads</th>
              <th className="p-4">Total</th>
              <th className="p-4">Bought</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-slate-400">
                  No eSIMs found.
                </td>
              </tr>
            )}
            {filtered.map((e) => {
              const expanded = !!open[e.id];
              const hasTopups = e.topup_count > 0;
              return (
                <Fragment key={e.id}>
                  <tr
                    onClick={() => hasTopups && setOpen((o) => ({ ...o, [e.id]: !o[e.id] }))}
                    className={`border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 ${
                      hasTopups ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40" : ""
                    }`}
                  >
                    <td className="p-4 text-slate-400">
                      {hasTopups &&
                        (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </td>
                    <td className="p-4">{e.email}</td>
                    <td className="p-4 font-medium">
                      {e.bundle_name}
                      {(e.country_name || e.location) && (
                        <span className="block text-xs text-slate-400">
                          {e.country_name || e.location}
                        </span>
                      )}
                    </td>
                    <td className="p-4">{data_label(e.data_mb)}</td>
                    <td className="p-4 font-mono text-xs">{e.iccid || "—"}</td>
                    <td className={`p-4 font-medium ${STATUS_TINT[e.status] || ""}`}>{e.status}</td>
                    <td className="p-4 tabular-nums">{money(e.amount_charged, e.currency)}</td>
                    <td className="p-4">
                      {hasTopups ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400">
                          <Wifi size={12} /> {e.topup_count}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4 tabular-nums font-semibold">
                      {money(e.total_charged, e.currency)}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{when(e.created_at)}</td>
                  </tr>

                  {expanded &&
                    e.topups.map((t) => (
                      <tr
                        key={`t-${t.id}`}
                        className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 text-xs"
                      >
                        <td className="p-3" />
                        <td className="p-3 text-slate-400">↳ reload</td>
                        <td className="p-3">{t.bundle_name || "Data reload"}</td>
                        <td className="p-3">{data_label(t.data_mb)}</td>
                        <td className="p-3" colSpan={2} />
                        <td className="p-3 tabular-nums">{money(t.amount_charged, t.currency)}</td>
                        <td className="p-3" />
                        <td className="p-3" />
                        <td className="p-3">{when(t.created_at)}</td>
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
